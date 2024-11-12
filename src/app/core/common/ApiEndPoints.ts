export enum ApiEndPoints {

    SIGNIN="api/v1/auth",


    AWARD_NOMINATION="api/v1/award-nominations",
    AWARD_NOMINATIONS_SEARCH="api/v1/award-nominations/search",
    AWARD_NOMINATION_STORE="api/v1/award-nominations",
    AWARD_SHEDULES_STORE="api/v1/award-schedules",
    AWARD_SCHEDULES_SHOW="api/v1/award-schedules",

    ROLES_INDEX="api/v1/roles",
    ROLES_SHOW="api/v1/roles/1",
    PRIVILEDGES_INDEX="api/v1/privileges",
    SEARCH_USERS_GET="api/v1/users/search",
    ROLES_CREATE="api/v1/authz",

    AWARD_NOMINATION_REPORTS_participants="api/v1/award-nominations/reports/participants",
    AWARD_NOMINATION_REPORTS_nominees="api/v1/award-nominations/reports/nominees",
    AWARD_NOMINATION_REPORTS_total_votes="api/v1/award-nominations/reports/total-votes",
    AWARD_NOMINATION_INDEX="api/v1/award-nominations",
    AWARD_SCHEDULES_UPDATE="api/v1/award-schedules",
    AWARD_NOMINATION_SUMMARY_REPORT="api/v1/award-nominations/summary-reports",
    AWARD_NOMINATION_MYNOMINEE="api/v1/award-nominations/my-nominee",

    OCCASIONS="api/v1/occasions",
    NATURES="api/v1/nature-of-conflicts",

    GIFTS_GIVEN_OUT_STORE="api/v1/gifts-given-out",
    GIFTS_GIVEN_OUT_GET="api/v1/gifts-given-out/history",
    GIFT_GIVEN_OUT_GET_PROGRESS="api/v1/gifts-given-out",

    GIFTS_RECEIVED_STORE="api/v1/gifts-received",
    GIFTS_RECEIVED_HISTORY="api/v1/gifts-received/history",
    GIFTS_RECEIVED_PROGRESS="api/v1/gifts-received",

    INDIVIDUAL_CONFLICTS_STORE="api/v1/coi-individual",
    INDIVIDUAL_CONFLICTS_HISTORY="api/v1/coi-individual/history",
    INDIVIDUAL_CONFLICTS_PROGRESS="api/v1/coi-individual",
    INDIVIDUAL_SUPERVISOR_REVEIW_POST="api/v1/coi-individual-review/supervisor",
    INDIVIDUAL_DECLARANT_ACTION_POST="api/v1/coi-individual-review/declarant",// either accepts or reverts
    INDIVIDUAL_HOD_REVEIW_POST="api/v1/coi-individual-review/hod",
    INDIVIDUAL_HOD_ISO_REVIEW="api/v1/coi-individual-review/hod-iso",    

    GROUP_CONFLICTS_SEARCH="api/v1/coi-group/search",
    GROUP_CONFLICTS_INITIATE="api/v1/coi-group/initiate",
    GROUP_CONFLICTS_GET_HISTORY="api/v1/coi-group/history",
    GROUP_CONFLICTS_GET_PROGRESS="api/v1/coi-group",

    GET_NOTIFICATIONS="api/v1/notifications",
    DECLARATION_POST="api/v1/coi-group/declare",
    REMARKS_POST="api/v1/coi-group/review",

    STATISTICS="api/v1/dashboard/statistics",
    PROFILE="api/v1/profile"
}

