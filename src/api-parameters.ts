// Generate using plurk2, data from https://www.plurk.com/API/2/list
// Do not edit manually!

export interface APIParameters {
  [api: string]: [any, any];
  'Users/me': [
    Users.MeOptions,
    any,
  ];
  'Users/getKarmaStats': [
    Users.GetKarmaStatsOptions,
    any,
  ];
  'Users/update': [
    Users.UpdateOptions,
    any,
  ];
  'Users/updateBackground': [
    Users.UpdateBackgroundOptions,
    any,
  ];
  'Users/setNameColor': [
    Users.SetNameColorOptions,
    any,
  ];
  'Users/getAliases': [
    Users.GetAliasesOptions,
    any,
  ];
  'Users/setAlias': [
    Users.SetAliasOptions,
    any,
  ];
  'Profile/getOwnProfile': [
    Profile.GetOwnProfileOptions,
    any,
  ];
  'Profile/getPublicProfile': [
    Profile.GetPublicProfileOptions,
    any,
  ];
  'Polling/getPlurks': [
    Polling.GetPlurksOptions,
    any,
  ];
  'Polling/getUnreadCount': [
    Polling.GetUnreadCountOptions,
    any,
  ];
  'Timeline/getPlurk': [
    Timeline.GetPlurkOptions,
    any,
  ];
  'Timeline/getPlurkCountsInfo': [
    Timeline.GetPlurkCountsInfoOptions,
    any,
  ];
  'Timeline/getPlurks': [
    Timeline.GetPlurksOptions,
    any,
  ];
  'Timeline/getPublicPlurks': [
    Timeline.GetPublicPlurksOptions,
    any,
  ];
  'Timeline/getUnreadPlurks': [
    Timeline.GetUnreadPlurksOptions,
    any,
  ];
  'Timeline/plurkAdd': [
    Timeline.PlurkAddOptions,
    any,
  ];
  'Timeline/plurkDelete': [
    Timeline.PlurkDeleteOptions,
    any,
  ];
  'Timeline/plurkEdit': [
    Timeline.PlurkEditOptions,
    any,
  ];
  'Timeline/mutePlurks': [
    Timeline.MutePlurksOptions,
    any,
  ];
  'Timeline/unmutePlurks': [
    Timeline.UnmutePlurksOptions,
    any,
  ];
  'Timeline/favoritePlurks': [
    Timeline.FavoritePlurksOptions,
    any,
  ];
  'Timeline/unfavoritePlurks': [
    Timeline.UnfavoritePlurksOptions,
    any,
  ];
  'Timeline/replurk': [
    Timeline.ReplurkOptions,
    any,
  ];
  'Timeline/unreplurk': [
    Timeline.UnreplurkOptions,
    any,
  ];
  'Timeline/markAsRead': [
    Timeline.MarkAsReadOptions,
    any,
  ];
  'Timeline/uploadPicture': [
    Timeline.UploadPictureOptions,
    any,
  ];
  'Timeline/toggleComments': [
    Timeline.ToggleCommentsOptions,
    any,
  ];
  'Timeline/setPorn': [
    Timeline.SetPornOptions,
    any,
  ];
  'Timeline/reportAbuse': [
    Timeline.ReportAbuseOptions,
    any,
  ];
  'Timeline/setUnreadSnapshot': [
    Timeline.SetUnreadSnapshotOptions,
    any,
  ];
  'Timeline/markAllAsRead': [
    Timeline.MarkAllAsReadOptions,
    any,
  ];
  'Responses/get': [
    Responses.GetOptions,
    any,
  ];
  'Responses/getById': [
    Responses.GetByIdOptions,
    any,
  ];
  'Responses/getAroundSeen': [
    Responses.GetAroundSeenOptions,
    any,
  ];
  'Responses/responseAdd': [
    Responses.ResponseAddOptions,
    any,
  ];
  'Responses/responseDelete': [
    Responses.ResponseDeleteOptions,
    any,
  ];
  'Responses/edit': [
    Responses.EditOptions,
    any,
  ];
  'Responses/reportAbuse': [
    Responses.ReportAbuseOptions,
    any,
  ];
  'FriendsFans/getFriendsByOffset': [
    FriendsFans.GetFriendsByOffsetOptions,
    any,
  ];
  'FriendsFans/getFansByOffset': [
    FriendsFans.GetFansByOffsetOptions,
    any,
  ];
  'FriendsFans/getFollowingByOffset': [
    FriendsFans.GetFollowingByOffsetOptions,
    any,
  ];
  'FriendsFans/becomeFriend': [
    FriendsFans.BecomeFriendOptions,
    any,
  ];
  'FriendsFans/removeAsFriend': [
    FriendsFans.RemoveAsFriendOptions,
    any,
  ];
  'FriendsFans/becomeFan': [
    FriendsFans.BecomeFanOptions,
    any,
  ];
  'FriendsFans/setFollowing': [
    FriendsFans.SetFollowingOptions,
    any,
  ];
  'FriendsFans/getCompletion': [
    FriendsFans.GetCompletionOptions,
    any,
  ];
  'FriendsFans/getFriendshipRequests': [
    FriendsFans.GetFriendshipRequestsOptions,
    any,
  ];
  'FriendsFans/setFollowingReplurk': [
    FriendsFans.SetFollowingReplurkOptions,
    any,
  ];
  'Alerts/getActive': [
    Alerts.GetActiveOptions,
    any,
  ];
  'Alerts/getUnreadCounts': [
    Alerts.GetUnreadCountsOptions,
    any,
  ];
  'Alerts/getHistory': [
    Alerts.GetHistoryOptions,
    any,
  ];
  'Alerts/addAsFan': [
    Alerts.AddAsFanOptions,
    any,
  ];
  'Alerts/addAllAsFan': [
    Alerts.AddAllAsFanOptions,
    any,
  ];
  'Alerts/addAllAsFriends': [
    Alerts.AddAllAsFriendsOptions,
    any,
  ];
  'Alerts/denyAll': [
    Alerts.DenyAllOptions,
    any,
  ];
  'Alerts/addAsFriend': [
    Alerts.AddAsFriendOptions,
    any,
  ];
  'Alerts/denyFriendship': [
    Alerts.DenyFriendshipOptions,
    any,
  ];
  'Alerts/removeNotification': [
    Alerts.RemoveNotificationOptions,
    any,
  ];
  'PlurkSearch/search': [
    PlurkSearch.SearchOptions,
    any,
  ];
  'UserSearch/search': [
    UserSearch.SearchOptions,
    any,
  ];
  'UserSearch/searchAllField': [
    UserSearch.SearchAllFieldOptions,
    any,
  ];
  'Emoticons/get': [
    Emoticons.GetOptions,
    any,
  ];
  'Emoticons/addFromURL': [
    Emoticons.AddFromURLOptions,
    any,
  ];
  'Emoticons/delete': [
    Emoticons.DeleteOptions,
    any,
  ];
  'Blocks/get': [
    Blocks.GetOptions,
    any,
  ];
  'Blocks/block': [
    Blocks.BlockOptions,
    any,
  ];
  'Blocks/unblock': [
    Blocks.UnblockOptions,
    any,
  ];
  'Cliques/getCliques': [
    Cliques.GetCliquesOptions,
    any,
  ];
  'Cliques/getClique': [
    Cliques.GetCliqueOptions,
    any,
  ];
  'Cliques/createClique': [
    Cliques.CreateCliqueOptions,
    any,
  ];
  'Cliques/deleteClique': [
    Cliques.DeleteCliqueOptions,
    any,
  ];
  'Cliques/renameClique': [
    Cliques.RenameCliqueOptions,
    any,
  ];
  'Cliques/add': [
    Cliques.AddOptions,
    any,
  ];
  'Cliques/remove': [
    Cliques.RemoveOptions,
    any,
  ];
  'Bookmarks/setBookmark': [
    Bookmarks.SetBookmarkOptions,
    any,
  ];
  'Bookmarks/getBookmarks': [
    Bookmarks.GetBookmarksOptions,
    any,
  ];
  'Bookmarks/getBookmark': [
    Bookmarks.GetBookmarkOptions,
    any,
  ];
  'Bookmarks/updateBookmark': [
    Bookmarks.UpdateBookmarkOptions,
    any,
  ];
  'Bookmarks/getTags': [
    Bookmarks.GetTagsOptions,
    any,
  ];
  'Bookmarks/createTag': [
    Bookmarks.CreateTagOptions,
    any,
  ];
  'Bookmarks/updateTag': [
    Bookmarks.UpdateTagOptions,
    any,
  ];
  'Bookmarks/removeTag': [
    Bookmarks.RemoveTagOptions,
    any,
  ];
  'Realtime/getUserChannel': [
    Realtime.GetUserChannelOptions,
    any,
  ];
  'checkToken': [
    CheckTokenOptions,
    any,
  ];
  'expireToken': [
    ExpireTokenOptions,
    any,
  ];
  'checkTime': [
    CheckTimeOptions,
    any,
  ];
  'checkIP': [
    CheckIPOptions,
    any,
  ];
  'echo': [
    EchoOptions,
    any,
  ];
}

export namespace Users {
  export interface MeOptions {
  }

  export interface GetKarmaStatsOptions {
  }

  export interface UpdateOptions {
    full_name?: any;
    display_name?: any;
    gender?: any;
    name_color?: any;
    date_of_birth?: any;
    birthday_privacy?: any;
    country_id?: any;
    relationship?: any;
    about?: any;
    email?: any;
    privacy?: any;
    creature?: any;
    creature_special?: any;
    filter_porn?: 0 | 1 | 2;
    filter_anonymous?: 0 | 1;
    filter_keywords?: any;
    pinned_plurk_id?: 0 | number;
    friend_list_privacy?: 'public' | 'friends-only' | 'only-me';
    accept_gift?: 'always' | 'friends-only' | 'never';
  }

  export interface UpdateBackgroundOptions {
    bg_image: any;
  }

  export interface SetNameColorOptions {
    color: 'red' | 'green' | 'blue' | 'default' | 'pink' | 'gold' | 'lightblue' | 'lightgreen' | 'orange' | 'purple';
  }

  export interface GetAliasesOptions {
  }

  export interface SetAliasOptions {
    user_id: any;
    alias: any;
  }
}

export namespace Profile {
  export interface GetOwnProfileOptions {
    minimal_data?: boolean;
    minimal_user?: boolean;
    include_plurks?: boolean;
  }

  export interface GetPublicProfileOptions {
    user_id: any;
    nick_name: any;
    minimal_data?: boolean;
    include_plurks?: boolean;
  }
}

export namespace Polling {
  export interface GetPlurksOptions {
    offset: any;
    limit?: number;
    favorers_detail: any;
    limited_detail: any;
    replurkers_detail: any;
    minimal_data?: boolean;
    minimal_user?: boolean;
  }

  export interface GetUnreadCountOptions {
  }
}

export namespace Timeline {
  export interface GetPlurkOptions {
    plurk_id: any;
    favorers_detail: any;
    limited_detail: any;
    replurkers_detail: any;
    minimal_data?: boolean;
    minimal_user?: boolean;
  }

  export interface GetPlurkCountsInfoOptions {
    plurk_id: any;
  }

  export interface GetPlurksOptions {
    offset: any;
    limit?: number;
    filter: any;
    favorers_detail: any;
    limited_detail: any;
    replurkers_detail: any;
    minimal_data?: boolean;
    minimal_user?: boolean;
  }

  export interface GetPublicPlurksOptions {
    user_id: any;
    nick_name: any;
    offset?: string;
    limit?: number;
    favorers_detail: any;
    limited_detail: any;
    replurkers_detail: any;
    minimal_data?: boolean;
    minimal_user?: boolean;
    only_user?: boolean;
  }

  export interface GetUnreadPlurksOptions {
    offset: any;
    limit: any;
    filter?: string;
    favorers_detail: any;
    limited_detail: any;
    replurkers_detail: any;
    minimal_data?: boolean;
    minimal_user?: boolean;
  }

  export interface PlurkAddOptions {
    content: any;
    qualifier: any;
    limited_to?: string;
    excluded?: any;
    no_comments?: number;
    lang?: string;
    replurkable?: number;
    porn?: number;
    publish_to_followers?: number;
    publish_to_anonymous?: number;
  }

  export interface PlurkDeleteOptions {
    plurk_id: any;
  }

  export interface PlurkEditOptions {
    plurk_id: any;
    content?: any;
    no_comments?: null | 0 | 1 | 2;
    limited_to?: any;
    excluded?: any;
    replurkable?: null | true | false;
    porn?: any;
  }

  export interface MutePlurksOptions {
    ids: any;
  }

  export interface UnmutePlurksOptions {
    ids: any;
  }

  export interface FavoritePlurksOptions {
    ids: any;
  }

  export interface UnfavoritePlurksOptions {
    ids: any;
  }

  export interface ReplurkOptions {
    ids: any;
  }

  export interface UnreplurkOptions {
    ids: any;
  }

  export interface MarkAsReadOptions {
    ids: any;
    note_position?: boolean;
  }

  export interface UploadPictureOptions {
    image: any;
  }

  export interface ToggleCommentsOptions {
    plurk_id: any;
    no_comments: any;
  }

  export interface SetPornOptions {
    plurk_id: any;
    porn: any;
  }

  export interface ReportAbuseOptions {
    plurk_id: any;
    category: any;
    reason: any;
  }

  export interface SetUnreadSnapshotOptions {
    filter?: string;
  }

  export interface MarkAllAsReadOptions {
    filter?: string;
    exclude_ids?: string;
  }
}

export namespace Responses {
  export interface GetOptions {
    plurk_id: any;
    from_response?: number;
    minimal_data?: boolean;
    minimal_user?: boolean;
    count?: number;
    only_owner?: boolean;
  }

  export interface GetByIdOptions {
    plurk_id: any;
    from_response_id?: number;
    minimal_data?: boolean;
    minimal_user?: boolean;
    count?: number;
  }

  export interface GetAroundSeenOptions {
    plurk_id: any;
    minimal_data?: boolean;
    minimal_user?: boolean;
    count?: number;
  }

  export interface ResponseAddOptions {
    plurk_id: any;
    content: any;
    qualifier: any;
  }

  export interface ResponseDeleteOptions {
    response_id: any;
    plurk_id: any;
  }

  export interface EditOptions {
    plurk_id: any;
    response_id: any;
    content: any;
  }

  export interface ReportAbuseOptions {
    plurk_id: any;
    response_id: any;
    category: any;
    reason: any;
  }
}

export namespace FriendsFans {
  export interface GetFriendsByOffsetOptions {
    user_id: any;
    offset?: number;
    limit?: number;
    minimal_data?: boolean;
  }

  export interface GetFansByOffsetOptions {
    user_id: any;
    offset?: number;
    limit?: number;
    minimal_data?: boolean;
  }

  export interface GetFollowingByOffsetOptions {
    offset?: number;
    limit?: number;
    minimal_data?: boolean;
  }

  export interface BecomeFriendOptions {
    friend_id: any;
  }

  export interface RemoveAsFriendOptions {
    friend_id: any;
  }

  export interface BecomeFanOptions {
    fan_id: any;
    follow?: boolean;
  }

  export interface SetFollowingOptions {
    user_id: any;
    follow: any;
  }

  export interface GetCompletionOptions {
  }

  export interface GetFriendshipRequestsOptions {
  }

  export interface SetFollowingReplurkOptions {
    user_id: any;
    follow: any;
  }
}

export namespace Alerts {
  export interface GetActiveOptions {
  }

  export interface GetUnreadCountsOptions {
  }

  export interface GetHistoryOptions {
  }

  export interface AddAsFanOptions {
    user_id: any;
  }

  export interface AddAllAsFanOptions {
  }

  export interface AddAllAsFriendsOptions {
  }

  export interface DenyAllOptions {
  }

  export interface AddAsFriendOptions {
    user_id: any;
  }

  export interface DenyFriendshipOptions {
    user_id: any;
  }

  export interface RemoveNotificationOptions {
    user_id: any;
  }
}

export namespace PlurkSearch {
  export interface SearchOptions {
    query: any;
    offset?: number;
  }
}

export namespace UserSearch {
  export interface SearchOptions {
    query: any;
    offset?: number;
    type?: string;
  }

  export interface SearchAllFieldOptions {
    query: any;
    offset?: number;
  }
}

export namespace Emoticons {
  export interface GetOptions {
    custom_only?: boolean;
    non_custom_only?: boolean;
  }

  export interface AddFromURLOptions {
    url: any;
    keyword?: any;
  }

  export interface DeleteOptions {
    url: any;
  }
}

export namespace Blocks {
  export interface GetOptions {
    offset?: number;
  }

  export interface BlockOptions {
    user_id: any;
  }

  export interface UnblockOptions {
    user_id: any;
  }
}

export namespace Cliques {
  export interface GetCliquesOptions {
  }

  export interface GetCliqueOptions {
    clique_name: any;
  }

  export interface CreateCliqueOptions {
    clique_name: any;
  }

  export interface DeleteCliqueOptions {
    clique_name: any;
  }

  export interface RenameCliqueOptions {
    clique_name: any;
    new_name: any;
  }

  export interface AddOptions {
    clique_name: any;
    user_id: any;
  }

  export interface RemoveOptions {
    clique_name: any;
    user_id: any;
  }
}

export namespace Bookmarks {
  export interface SetBookmarkOptions {
    plurk_id: any;
    bookmark: any;
    tags: any;
    as_reward?: number;
  }

  export interface GetBookmarksOptions {
    tags: any;
    from_bookmark_id: any;
    limit: any;
    minimal_user?: boolean;
    minimal_data?: boolean;
  }

  export interface GetBookmarkOptions {
    plurk_id: any;
  }

  export interface UpdateBookmarkOptions {
    bookmark_id: any;
    tags: any;
  }

  export interface GetTagsOptions {
  }

  export interface CreateTagOptions {
    tag: any;
  }

  export interface UpdateTagOptions {
    tag: any;
    rename: any;
  }

  export interface RemoveTagOptions {
    tag: any;
  }
}

export namespace Realtime {
  export interface GetUserChannelOptions {
  }
}

export interface CheckTokenOptions {
}

export interface ExpireTokenOptions {
}

export interface CheckTimeOptions {
}

export interface CheckIPOptions {
}

export interface EchoOptions {
  data: any;
}
