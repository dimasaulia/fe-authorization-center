"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";

import { getRoles } from "../../../../authorization-center/modules/roles/roles.service";
import type { Role } from "../../../../authorization-center/modules/roles/roles.type";
import { getTeams } from "../../../../authorization-center/modules/teams/teams.service";
import type { Team } from "../../../../authorization-center/modules/teams/teams.type";
import {
  getUserDetail,
  updateExistingUser,
} from "../../../modules/users/users.service";
import type { UserStatus, UserType, UserUpdatePayload } from "../../../modules/users/users.type";

function filterAssigned<T extends { id: number }>(items: T[], assignedItems: T[]) {
  return items.filter((item) => !assignedItems.some((assigned) => assigned.id === item.id));
}

function toAssignedRole(role: {
  id: number;
  app_id?: number | null;
  app_code?: string | null;
  app_name?: string | null;
  code?: string;
  name?: string;
  scope?: "global" | "app";
}): Role {
  return {
    id: role.id,
    organization_id: null,
    app_id: role.app_id ?? null,
    app_code: role.app_code ?? null,
    app_name: role.app_name ?? null,
    code: role.code ?? `role-${role.id}`,
    name: role.name ?? `Role #${role.id}`,
    description: "",
    scope: role.scope ?? "global",
    is_system: false,
    status: "active",
    created_at: "",
    updated_at: "",
  };
}

function toAssignedTeam(team: {
  id: number;
  organization_id?: number;
  code?: string;
  name?: string;
  status?: "active" | "inactive";
  created_at?: string;
}): Team {
  return {
    id: team.id,
    organization_id: team.organization_id ?? 1,
    code: team.code ?? `team-${team.id}`,
    name: team.name ?? `Team #${team.id}`,
    status: team.status ?? "active",
    created_at: team.created_at ?? "",
  };
}

export function useUserEditController(userId: string) {
  const { language, t } = usePreferences();
  const router = useRouter();
  const numericUserId = useMemo(() => Number(userId), [userId]);
  const isValidUserId = Number.isFinite(numericUserId);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [organizationId, setOrganizationId] = useState(1);
  const [type, setType] = useState<UserType>("internal");
  const [status, setStatus] = useState<UserStatus>("active");
  const [mustChangePassword, setMustChangePassword] = useState(false);

  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [assignedRoles, setAssignedRoles] = useState<Role[]>([]);
  const assignedRolesRef = useRef<Role[]>([]);
  const [roleSearch, setRoleSearch] = useState("");
  const [roleSearchLoading, setRoleSearchLoading] = useState(false);
  const roleSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [assignedTeams, setAssignedTeams] = useState<Team[]>([]);
  const assignedTeamsRef = useRef<Team[]>([]);
  const [teamSearch, setTeamSearch] = useState("");
  const [teamSearchLoading, setTeamSearchLoading] = useState(false);
  const teamSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [draggingRole, setDraggingRole] = useState<Role | null>(null);
  const [draggingTeam, setDraggingTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(isValidUserId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    isValidUserId ? null : t("common.error.notFound"),
  );

  const fetchRoles = useCallback(
    (q: string, currentAssignedRoles = assignedRolesRef.current) => {
      if (roleSearchTimer.current) clearTimeout(roleSearchTimer.current);
      setRoleSearchLoading(true);

      roleSearchTimer.current = setTimeout(() => {
        getRoles({ limit: 30, offset: 0, search: q }, language)
          .then((items) => {
            setAvailableRoles(filterAssigned(items, currentAssignedRoles));
            setRoleSearchLoading(false);
          })
          .catch(() => setRoleSearchLoading(false));
      }, 300);
    },
    [language],
  );

  const fetchTeams = useCallback(
    (q: string, currentAssignedTeams = assignedTeamsRef.current) => {
      if (teamSearchTimer.current) clearTimeout(teamSearchTimer.current);
      setTeamSearchLoading(true);

      teamSearchTimer.current = setTimeout(() => {
        getTeams({ search: q })
          .then((items) => {
            setAvailableTeams(filterAssigned(items, currentAssignedTeams));
            setTeamSearchLoading(false);
          })
          .catch(() => setTeamSearchLoading(false));
      }, 300);
    },
    [],
  );

  useEffect(() => {
    if (!isValidUserId) return;

    let isActive = true;

    getUserDetail(numericUserId, language)
      .then((user) => {
        if (!isActive) return;

        const nextAssignedRoles = user.roles?.map(toAssignedRole)
          ?? user.role_ids?.map((id) => toAssignedRole({ id }))
          ?? [];
        const nextAssignedTeams = user.teams?.map(toAssignedTeam)
          ?? user.team_ids?.map((id) => toAssignedTeam({ id }))
          ?? [];

        setUsername(user.username);
        setEmail(user.email);
        setDisplayName(user.display_name);
        setOrganizationId(user.organization_id);
        setType(user.type);
        setStatus(user.status);
        setMustChangePassword(Boolean(user.must_change_password));
        assignedRolesRef.current = nextAssignedRoles;
        assignedTeamsRef.current = nextAssignedTeams;
        setAssignedRoles(nextAssignedRoles);
        setAssignedTeams(nextAssignedTeams);
        fetchRoles("", nextAssignedRoles);
        fetchTeams("", nextAssignedTeams);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isActive) return;
        setError(t("common.error.loadFailed"));
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [fetchRoles, fetchTeams, isValidUserId, language, numericUserId, t]);

  useEffect(() => () => {
    if (roleSearchTimer.current) clearTimeout(roleSearchTimer.current);
    if (teamSearchTimer.current) clearTimeout(teamSearchTimer.current);
  }, []);

  const handleRoleSearch = useCallback(
    (q: string) => {
      setRoleSearch(q);
      fetchRoles(q);
    },
    [fetchRoles],
  );

  const handleTeamSearch = useCallback(
    (q: string) => {
      setTeamSearch(q);
      fetchTeams(q);
    },
    [fetchTeams],
  );

  const assignRole = useCallback((role: Role) => {
    setAssignedRoles((prev) => {
      if (prev.some((item) => item.id === role.id)) return prev;

      const next = [...prev, role];
      assignedRolesRef.current = next;

      return next;
    });
    setAvailableRoles((prev) => prev.filter((item) => item.id !== role.id));
  }, []);

  const unassignRole = useCallback((role: Role) => {
    setAssignedRoles((prev) => {
      const next = prev.filter((item) => item.id !== role.id);
      assignedRolesRef.current = next;

      return next;
    });
    setAvailableRoles((prev) => {
      if (prev.some((item) => item.id === role.id)) return prev;

      return [...prev, role];
    });
  }, []);

  const assignTeam = useCallback((team: Team) => {
    setAssignedTeams((prev) => {
      if (prev.some((item) => item.id === team.id)) return prev;

      const next = [...prev, team];
      assignedTeamsRef.current = next;

      return next;
    });
    setAvailableTeams((prev) => prev.filter((item) => item.id !== team.id));
  }, []);

  const unassignTeam = useCallback((team: Team) => {
    setAssignedTeams((prev) => {
      const next = prev.filter((item) => item.id !== team.id);
      assignedTeamsRef.current = next;

      return next;
    });
    setAvailableTeams((prev) => {
      if (prev.some((item) => item.id === team.id)) return prev;

      return [...prev, team];
    });
  }, []);

  const onRoleDragStart = useCallback((role: Role) => setDraggingRole(role), []);
  const onRoleDragEnd = useCallback(() => setDraggingRole(null), []);
  const onRoleDropToAssigned = useCallback(() => {
    if (draggingRole) assignRole(draggingRole);
    setDraggingRole(null);
  }, [assignRole, draggingRole]);
  const onRoleDropToAvailable = useCallback(() => {
    if (draggingRole) unassignRole(draggingRole);
    setDraggingRole(null);
  }, [draggingRole, unassignRole]);

  const onTeamDragStart = useCallback((team: Team) => setDraggingTeam(team), []);
  const onTeamDragEnd = useCallback(() => setDraggingTeam(null), []);
  const onTeamDropToAssigned = useCallback(() => {
    if (draggingTeam) assignTeam(draggingTeam);
    setDraggingTeam(null);
  }, [assignTeam, draggingTeam]);
  const onTeamDropToAvailable = useCallback(() => {
    if (draggingTeam) unassignTeam(draggingTeam);
    setDraggingTeam(null);
  }, [draggingTeam, unassignTeam]);

  const submit = useCallback(() => {
    if (!username || !email || !displayName || !isValidUserId) {
      setError(t("users.edit.error"));

      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload: UserUpdatePayload = {
      organization_id: organizationId,
      username,
      email,
      display_name: displayName,
      type,
      status,
      must_change_password: mustChangePassword,
      role_ids: assignedRoles.map((role) => role.id),
      team_ids: assignedTeams.map((team) => team.id),
    };

    if (password) {
      payload.password = password;
    }

    updateExistingUser(numericUserId, payload, language)
      .then(() => {
        router.push(routes.users);
      })
      .catch(() => {
        setError(t("users.edit.error"));
        setIsSubmitting(false);
      });
  }, [
    assignedRoles,
    assignedTeams,
    displayName,
    email,
    isValidUserId,
    language,
    mustChangePassword,
    numericUserId,
    organizationId,
    password,
    router,
    status,
    t,
    type,
    username,
  ]);

  const cancel = useCallback(() => {
    router.push(routes.users);
  }, [router]);

  return {
    cancel,
    availableRoles,
    assignedRoles,
    roleSearch,
    roleSearchLoading,
    handleRoleSearch,
    assignRole,
    unassignRole,
    draggingRole,
    onRoleDragStart,
    onRoleDragEnd,
    onRoleDropToAssigned,
    onRoleDropToAvailable,
    availableTeams,
    assignedTeams,
    teamSearch,
    teamSearchLoading,
    handleTeamSearch,
    assignTeam,
    unassignTeam,
    draggingTeam,
    onTeamDragStart,
    onTeamDragEnd,
    onTeamDropToAssigned,
    onTeamDropToAvailable,
    displayName,
    email,
    error,
    isLoading,
    isSubmitting,
    mustChangePassword,
    password,
    setDisplayName,
    setEmail,
    setMustChangePassword,
    setPassword,
    setStatus,
    setUsername,
    status,
    submit,
    username,
  };
}
