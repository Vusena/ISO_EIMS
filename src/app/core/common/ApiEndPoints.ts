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
    
    GIFTS_GIVEN_OUT="api/v1/occasions",
    GIFTS_GIVEN_OUT_STORE="api/v1/gifts-given-out",
    GIFTS_GIVEN_OUT_GET="api/v1/gifts-given-out/history",
    GIFT_GIVEN_OUT_GET_PROGRESS="api/v1/gifts-given-out",

    GROUP_CONFLICTS_SEARCH="api/v1/coi-group/search"

}