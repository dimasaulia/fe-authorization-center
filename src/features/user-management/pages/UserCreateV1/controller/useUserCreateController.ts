"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";

import { createNewUser } from "../../../modules/users/users.service";
import { getRoles } from "../../../../authorization-center/modules/roles/roles.service";
import { getTeams } from "../../../../authorization-center/modules/teams/teams.service";
import type { UserCreatePayload, UserStatus, UserType } from "../../../modules/users/users.type";
import type { Role } from "../../../../authorization-center/modules/roles/roles.type";
import type { Team } from "../../../../authorization-center/modules/teams/teams.type";

export function useUserCreateController() {
  const { language, t } = usePreferences();
  const router = useRouter();

  // Form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [type] = useState<UserType>("internal");
  const [status, setStatus] = useState<UserStatus>("active");
  const [mustChangePassword, setMustChangePassword] = useState(true);
  const [sendInvitation, setSendInvitation] = useState(false);
  const [createInKeycloak, setCreateInKeycloak] = useState(true);
  const [createInFreeipa, setCreateInFreeipa] = useState(false);

  // Role assignment
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [assignedRoles, setAssignedRoles] = useState<Role[]>([]);
  const [roleSearch, setRoleSearch] = useState("");
  const [roleSearchLoading, setRoleSearchLoading] = useState(false);
  const roleSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Team assignment
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [assignedTeams, setAssignedTeams] = useState<Team[]>([]);
  const [teamSearch, setTeamSearch] = useState("");
  const [teamSearchLoading, setTeamSearchLoading] = useState(false);
  const teamSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Drag state
  const [draggingRole, setDraggingRole] = useState<Role | null>(null);
  const [draggingTeam, setDraggingTeam] = useState<Team | null>(null);

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch roles with debounce
  const fetchRoles = useCallback(
    (q: string) => {
      if (roleSearchTimer.current) clearTimeout(roleSearchTimer.current);
      setRoleSearchLoading(true);

      roleSearchTimer.current = setTimeout(() => {
        getRoles({ limit: 30, offset: 0, search: q }, language)
          .then((items) => {
            setAvailableRoles(items.filter((r) => !assignedRoles.some((a) => a.id === r.id)));
            setRoleSearchLoading(false);
          })
          .catch(() => setRoleSearchLoading(false));
      }, 300);
    },
    [language, assignedRoles],
  );

  // Fetch teams with debounce
  const fetchTeams = useCallback(
    (q: string) => {
      if (teamSearchTimer.current) clearTimeout(teamSearchTimer.current);
      setTeamSearchLoading(true);

      teamSearchTimer.current = setTimeout(() => {
        getTeams({ search: q })
          .then((items) => {
            setAvailableTeams(items.filter((t) => !assignedTeams.some((a) => a.id === t.id)));
            setTeamSearchLoading(false);
          })
          .catch(() => setTeamSearchLoading(false));
      }, 300);
    },
    [assignedTeams],
  );

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRoles("");
      fetchTeams("");
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Role search handler
  const handleRoleSearch = useCallback(
    (q: string) => {
      setRoleSearch(q);
      fetchRoles(q);
    },
    [fetchRoles],
  );

  // Team search handler
  const handleTeamSearch = useCallback(
    (q: string) => {
      setTeamSearch(q);
      fetchTeams(q);
    },
    [fetchTeams],
  );

  // Assign role (click or drop)
  const assignRole = useCallback((role: Role) => {
    setAssignedRoles((prev) => {
      if (prev.some((r) => r.id === role.id)) return prev;

      return [...prev, role];
    });
    setAvailableRoles((prev) => prev.filter((r) => r.id !== role.id));
  }, []);

  // Unassign role
  const unassignRole = useCallback((role: Role) => {
    setAssignedRoles((prev) => prev.filter((r) => r.id !== role.id));
    setAvailableRoles((prev) => {
      if (prev.some((r) => r.id === role.id)) return prev;

      return [...prev, role];
    });
  }, []);

  // Assign team
  const assignTeam = useCallback((team: Team) => {
    setAssignedTeams((prev) => {
      if (prev.some((t) => t.id === team.id)) return prev;

      return [...prev, team];
    });
    setAvailableTeams((prev) => prev.filter((t) => t.id !== team.id));
  }, []);

  // Unassign team
  const unassignTeam = useCallback((team: Team) => {
    setAssignedTeams((prev) => prev.filter((t) => t.id !== team.id));
    setAvailableTeams((prev) => {
      if (prev.some((t) => t.id === team.id)) return prev;

      return [...prev, team];
    });
  }, []);

  // Drag handlers — roles
  const onRoleDragStart = useCallback((role: Role) => setDraggingRole(role), []);
  const onRoleDragEnd = useCallback(() => setDraggingRole(null), []);
  const onRoleDropToAssigned = useCallback(() => {
    if (draggingRole) assignRole(draggingRole);
    setDraggingRole(null);
  }, [draggingRole, assignRole]);
  const onRoleDropToAvailable = useCallback(() => {
    if (draggingRole) unassignRole(draggingRole);
    setDraggingRole(null);
  }, [draggingRole, unassignRole]);

  // Drag handlers — teams
  const onTeamDragStart = useCallback((team: Team) => setDraggingTeam(team), []);
  const onTeamDragEnd = useCallback(() => setDraggingTeam(null), []);
  const onTeamDropToAssigned = useCallback(() => {
    if (draggingTeam) assignTeam(draggingTeam);
    setDraggingTeam(null);
  }, [draggingTeam, assignTeam]);
  const onTeamDropToAvailable = useCallback(() => {
    if (draggingTeam) unassignTeam(draggingTeam);
    setDraggingTeam(null);
  }, [draggingTeam, unassignTeam]);

  const submit = useCallback(() => {
    if (!username || !email || !displayName) {
      setSubmitError(t("users.create.error"));

      return;
    }

    if (status === "active" && !password) {
      setSubmitError(t("users.create.error"));

      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload: UserCreatePayload = {
      organization_id: 1,
      username,
      email,
      display_name: displayName,
      type,
      status,
      create_in_keycloak: createInKeycloak,
      create_in_freeipa: createInFreeipa,
      role_ids: assignedRoles.map((r) => r.id),
      team_ids: assignedTeams.map((t) => t.id),
    };

    if (status === "active") {
      payload.password = password;
      payload.must_change_password = mustChangePassword;
    }

    if (status === "invited") {
      payload.send_invitation = sendInvitation;
    }

    createNewUser(payload, language)
      .then(() => {
        router.push(routes.users);
      })
      .catch(() => {
        setSubmitError(t("users.create.error"));
        setIsSubmitting(false);
      });
  }, [
    username, email, displayName, password, type, status,
    mustChangePassword, sendInvitation, createInKeycloak, createInFreeipa,
    assignedRoles, assignedTeams, language, t, router,
  ]);

  const cancel = useCallback(() => {
    router.push(routes.users);
  }, [router]);

  return {
    // Form fields
    username, setUsername,
    email, setEmail,
    displayName, setDisplayName,
    password, setPassword,
    status, setStatus,
    mustChangePassword, setMustChangePassword,
    sendInvitation, setSendInvitation,
    createInKeycloak, setCreateInKeycloak,
    createInFreeipa, setCreateInFreeipa,
    // Roles
    availableRoles, assignedRoles,
    roleSearch, roleSearchLoading,
    handleRoleSearch, assignRole, unassignRole,
    draggingRole,
    onRoleDragStart, onRoleDragEnd,
    onRoleDropToAssigned, onRoleDropToAvailable,
    // Teams
    availableTeams, assignedTeams,
    teamSearch, teamSearchLoading,
    handleTeamSearch, assignTeam, unassignTeam,
    draggingTeam,
    onTeamDragStart, onTeamDragEnd,
    onTeamDropToAssigned, onTeamDropToAvailable,
    // Submit
    isSubmitting, submitError,
    submit, cancel,
  };
}
