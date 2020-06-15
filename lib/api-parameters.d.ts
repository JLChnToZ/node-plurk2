export interface APIParameters {
    [api: string]: [any, any];
    'Users/me': [Users.MeOptions, any];
    'Users/getKarmaStats': [Users.GetKarmaStatsOptions, any];
    'Users/update': [Users.UpdateOptions, any];
    'Users/updateBackground': [Users.UpdateBackgroundOptions, any];
    'Users/setNameColor': [Users.SetNameColorOptions, any];
    'Users/getAliases': [Users.GetAliasesOptions, any];
    'Users/setAlias': [Users.SetAliasOptions, any];
    'Profile/getOwnProfile': [Profile.GetOwnProfileOptions, any];
    'Profile/getPublicProfile': [Profile.GetPublicProfileOptions, any];
    'Polling/getPlurks': [Polling.GetPlurksOptions, any];
    'Polling/getUnreadCount': [Polling.GetUnreadCountOptions, any];
    'Timeline/getPlurk': [Timeline.GetPlurkOptions, any];
    'Timeline/getPlurkCountsInfo': [Timeline.GetPlurkCountsInfoOptions, any];
    'Timeline/getPlurks': [Timeline.GetPlurksOptions, any];
    'Timeline/getPublicPlurks': [Timeline.GetPublicPlurksOptions, any];
    'Timeline/getUnreadPlurks': [Timeline.GetUnreadPlurksOptions, any];
    'Timeline/plurkAdd': [Timeline.PlurkAddOptions, any];
    'Timeline/plurkDelete': [Timeline.PlurkDeleteOptions, any];
    'Timeline/plurkEdit': [Timeline.PlurkEditOptions, any];
    'Timeline/mutePlurks': [Timeline.MutePlurksOptions, any];
    'Timeline/unmutePlurks': [Timeline.UnmutePlurksOptions, any];
    'Timeline/favoritePlurks': [Timeline.FavoritePlurksOptions, any];
    'Timeline/unfavoritePlurks': [Timeline.UnfavoritePlurksOptions, any];
    'Timeline/replurk': [Timeline.ReplurkOptions, any];
    'Timeline/unreplurk': [Timeline.UnreplurkOptions, any];
    'Timeline/markAsRead': [Timeline.MarkAsReadOptions, any];
    'Timeline/uploadPicture': [Timeline.UploadPictureOptions, any];
    'Timeline/toggleComments': [Timeline.ToggleCommentsOptions, any];
    'Timeline/setPorn': [Timeline.SetPornOptions, any];
    'Timeline/reportAbuse': [Timeline.ReportAbuseOptions, any];
    'Timeline/setUnreadSnapshot': [Timeline.SetUnreadSnapshotOptions, any];
    'Timeline/markAllAsRead': [Timeline.MarkAllAsReadOptions, any];
    'Responses/get': [Responses.GetOptions, any];
    'Responses/getById': [Responses.GetByIdOptions, any];
    'Responses/getAroundSeen': [Responses.GetAroundSeenOptions, any];
    'Responses/responseAdd': [Responses.ResponseAddOptions, any];
    'Responses/responseDelete': [Responses.ResponseDeleteOptions, any];
    'Responses/edit': [Responses.EditOptions, any];
    'Responses/reportAbuse': [Responses.ReportAbuseOptions, any];
    'FriendsFans/getFriendsByOffset': [FriendsFans.GetFriendsByOffsetOptions, any];
    'FriendsFans/getFansByOffset': [FriendsFans.GetFansByOffsetOptions, any];
    'FriendsFans/getFollowingByOffset': [FriendsFans.GetFollowingByOffsetOptions, any];
    'FriendsFans/becomeFriend': [FriendsFans.BecomeFriendOptions, any];
    'FriendsFans/removeAsFriend': [FriendsFans.RemoveAsFriendOptions, any];
    'FriendsFans/becomeFan': [FriendsFans.BecomeFanOptions, any];
    'FriendsFans/setFollowing': [FriendsFans.SetFollowingOptions, any];
    'FriendsFans/getCompletion': [FriendsFans.GetCompletionOptions, any];
    'FriendsFans/getFriendshipRequests': [FriendsFans.GetFriendshipRequestsOptions, any];
    'FriendsFans/setFollowingReplurk': [FriendsFans.SetFollowingReplurkOptions, any];
    'Alerts/getActive': [Alerts.GetActiveOptions, any];
    'Alerts/getUnreadCounts': [Alerts.GetUnreadCountsOptions, any];
    'Alerts/getHistory': [Alerts.GetHistoryOptions, any];
    'Alerts/addAsFan': [Alerts.AddAsFanOptions, any];
    'Alerts/addAllAsFan': [Alerts.AddAllAsFanOptions, any];
    'Alerts/addAllAsFriends': [Alerts.AddAllAsFriendsOptions, any];
    'Alerts/denyAll': [Alerts.DenyAllOptions, any];
    'Alerts/addAsFriend': [Alerts.AddAsFriendOptions, any];
    'Alerts/denyFriendship': [Alerts.DenyFriendshipOptions, any];
    'Alerts/removeNotification': [Alerts.RemoveNotificationOptions, any];
    'PlurkSearch/search': [PlurkSearch.SearchOptions, any];
    'UserSearch/search': [UserSearch.SearchOptions, any];
    'UserSearch/searchAllField': [UserSearch.SearchAllFieldOptions, any];
    'Emoticons/get': [Emoticons.GetOptions, any];
    'Emoticons/addFromURL': [Emoticons.AddFromURLOptions, any];
    'Emoticons/delete': [Emoticons.DeleteOptions, any];
    'Blocks/get': [Blocks.GetOptions, any];
    'Blocks/block': [Blocks.BlockOptions, any];
    'Blocks/unblock': [Blocks.UnblockOptions, any];
    'Cliques/getCliques': [Cliques.GetCliquesOptions, any];
    'Cliques/getClique': [Cliques.GetCliqueOptions, any];
    'Cliques/createClique': [Cliques.CreateCliqueOptions, any];
    'Cliques/deleteClique': [Cliques.DeleteCliqueOptions, any];
    'Cliques/renameClique': [Cliques.RenameCliqueOptions, any];
    'Cliques/add': [Cliques.AddOptions, any];
    'Cliques/remove': [Cliques.RemoveOptions, any];
    'Bookmarks/setBookmark': [Bookmarks.SetBookmarkOptions, any];
    'Bookmarks/getBookmarks': [Bookmarks.GetBookmarksOptions, any];
    'Bookmarks/getBookmark': [Bookmarks.GetBookmarkOptions, any];
    'Bookmarks/updateBookmark': [Bookmarks.UpdateBookmarkOptions, any];
    'Bookmarks/getTags': [Bookmarks.GetTagsOptions, any];
    'Bookmarks/createTag': [Bookmarks.CreateTagOptions, any];
    'Bookmarks/updateTag': [Bookmarks.UpdateTagOptions, any];
    'Bookmarks/removeTag': [Bookmarks.RemoveTagOptions, any];
    'Realtime/getUserChannel': [Realtime.GetUserChannelOptions, any];
    'checkToken': [CheckTokenOptions, any];
    'expireToken': [ExpireTokenOptions, any];
    'checkTime': [CheckTimeOptions, any];
    'checkIP': [CheckIPOptions, any];
    'echo': [EchoOptions, any];
}
export declare namespace Users {
    interface MeOptions {
    }
    interface GetKarmaStatsOptions {
    }
    interface UpdateOptions {
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
    interface UpdateBackgroundOptions {
        bg_image: any;
    }
    interface SetNameColorOptions {
        color: 'red' | 'green' | 'blue' | 'default' | 'pink' | 'gold' | 'lightblue' | 'lightgreen' | 'orange' | 'purple';
    }
    interface GetAliasesOptions {
    }
    interface SetAliasOptions {
        user_id: any;
        alias: any;
    }
}
export declare namespace Profile {
    interface GetOwnProfileOptions {
        minimal_data?: boolean;
        minimal_user?: boolean;
        include_plurks?: boolean;
    }
    interface GetPublicProfileOptions {
        user_id: any;
        nick_name: any;
        minimal_data?: boolean;
        include_plurks?: boolean;
    }
}
export declare namespace Polling {
    interface GetPlurksOptions {
        offset: any;
        limit?: number;
        favorers_detail: any;
        limited_detail: any;
        replurkers_detail: any;
        minimal_data?: boolean;
        minimal_user?: boolean;
    }
    interface GetUnreadCountOptions {
    }
}
export declare namespace Timeline {
    interface GetPlurkOptions {
        plurk_id: any;
        favorers_detail: any;
        limited_detail: any;
        replurkers_detail: any;
        minimal_data?: boolean;
        minimal_user?: boolean;
    }
    interface GetPlurkCountsInfoOptions {
        plurk_id: any;
    }
    interface GetPlurksOptions {
        offset: any;
        limit?: number;
        filter: any;
        favorers_detail: any;
        limited_detail: any;
        replurkers_detail: any;
        minimal_data?: boolean;
        minimal_user?: boolean;
    }
    interface GetPublicPlurksOptions {
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
    interface GetUnreadPlurksOptions {
        offset: any;
        limit: any;
        filter?: string;
        favorers_detail: any;
        limited_detail: any;
        replurkers_detail: any;
        minimal_data?: boolean;
        minimal_user?: boolean;
    }
    interface PlurkAddOptions {
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
    interface PlurkDeleteOptions {
        plurk_id: any;
    }
    interface PlurkEditOptions {
        plurk_id: any;
        content?: any;
        no_comments?: null | 0 | 1 | 2;
        limited_to?: any;
        excluded?: any;
        replurkable?: null | true | false;
        porn?: any;
    }
    interface MutePlurksOptions {
        ids: any;
    }
    interface UnmutePlurksOptions {
        ids: any;
    }
    interface FavoritePlurksOptions {
        ids: any;
    }
    interface UnfavoritePlurksOptions {
        ids: any;
    }
    interface ReplurkOptions {
        ids: any;
    }
    interface UnreplurkOptions {
        ids: any;
    }
    interface MarkAsReadOptions {
        ids: any;
        note_position?: boolean;
    }
    interface UploadPictureOptions {
        image: any;
    }
    interface ToggleCommentsOptions {
        plurk_id: any;
        no_comments: any;
    }
    interface SetPornOptions {
        plurk_id: any;
        porn: any;
    }
    interface ReportAbuseOptions {
        plurk_id: any;
        category: any;
        reason: any;
    }
    interface SetUnreadSnapshotOptions {
        filter?: string;
    }
    interface MarkAllAsReadOptions {
        filter?: string;
        exclude_ids?: string;
    }
}
export declare namespace Responses {
    interface GetOptions {
        plurk_id: any;
        from_response?: number;
        minimal_data?: boolean;
        minimal_user?: boolean;
        count?: number;
        only_owner?: boolean;
    }
    interface GetByIdOptions {
        plurk_id: any;
        from_response_id?: number;
        minimal_data?: boolean;
        minimal_user?: boolean;
        count?: number;
    }
    interface GetAroundSeenOptions {
        plurk_id: any;
        minimal_data?: boolean;
        minimal_user?: boolean;
        count?: number;
    }
    interface ResponseAddOptions {
        plurk_id: any;
        content: any;
        qualifier: any;
    }
    interface ResponseDeleteOptions {
        response_id: any;
        plurk_id: any;
    }
    interface EditOptions {
        plurk_id: any;
        response_id: any;
        content: any;
    }
    interface ReportAbuseOptions {
        plurk_id: any;
        response_id: any;
        category: any;
        reason: any;
    }
}
export declare namespace FriendsFans {
    interface GetFriendsByOffsetOptions {
        user_id: any;
        offset?: number;
        limit?: number;
        minimal_data?: boolean;
    }
    interface GetFansByOffsetOptions {
        user_id: any;
        offset?: number;
        limit?: number;
        minimal_data?: boolean;
    }
    interface GetFollowingByOffsetOptions {
        offset?: number;
        limit?: number;
        minimal_data?: boolean;
    }
    interface BecomeFriendOptions {
        friend_id: any;
    }
    interface RemoveAsFriendOptions {
        friend_id: any;
    }
    interface BecomeFanOptions {
        fan_id: any;
        follow?: boolean;
    }
    interface SetFollowingOptions {
        user_id: any;
        follow: any;
    }
    interface GetCompletionOptions {
    }
    interface GetFriendshipRequestsOptions {
    }
    interface SetFollowingReplurkOptions {
        user_id: any;
        follow: any;
    }
}
export declare namespace Alerts {
    interface GetActiveOptions {
    }
    interface GetUnreadCountsOptions {
    }
    interface GetHistoryOptions {
    }
    interface AddAsFanOptions {
        user_id: any;
    }
    interface AddAllAsFanOptions {
    }
    interface AddAllAsFriendsOptions {
    }
    interface DenyAllOptions {
    }
    interface AddAsFriendOptions {
        user_id: any;
    }
    interface DenyFriendshipOptions {
        user_id: any;
    }
    interface RemoveNotificationOptions {
        user_id: any;
    }
}
export declare namespace PlurkSearch {
    interface SearchOptions {
        query: any;
        offset?: number;
    }
}
export declare namespace UserSearch {
    interface SearchOptions {
        query: any;
        offset?: number;
        type?: string;
    }
    interface SearchAllFieldOptions {
        query: any;
        offset?: number;
    }
}
export declare namespace Emoticons {
    interface GetOptions {
        custom_only?: boolean;
        non_custom_only?: boolean;
    }
    interface AddFromURLOptions {
        url: any;
        keyword?: any;
    }
    interface DeleteOptions {
        url: any;
    }
}
export declare namespace Blocks {
    interface GetOptions {
        offset?: number;
    }
    interface BlockOptions {
        user_id: any;
    }
    interface UnblockOptions {
        user_id: any;
    }
}
export declare namespace Cliques {
    interface GetCliquesOptions {
    }
    interface GetCliqueOptions {
        clique_name: any;
    }
    interface CreateCliqueOptions {
        clique_name: any;
    }
    interface DeleteCliqueOptions {
        clique_name: any;
    }
    interface RenameCliqueOptions {
        clique_name: any;
        new_name: any;
    }
    interface AddOptions {
        clique_name: any;
        user_id: any;
    }
    interface RemoveOptions {
        clique_name: any;
        user_id: any;
    }
}
export declare namespace Bookmarks {
    interface SetBookmarkOptions {
        plurk_id: any;
        bookmark: any;
        tags: any;
        as_reward?: number;
    }
    interface GetBookmarksOptions {
        tags: any;
        from_bookmark_id: any;
        limit: any;
        minimal_user?: boolean;
        minimal_data?: boolean;
    }
    interface GetBookmarkOptions {
        plurk_id: any;
    }
    interface UpdateBookmarkOptions {
        bookmark_id: any;
        tags: any;
    }
    interface GetTagsOptions {
    }
    interface CreateTagOptions {
        tag: any;
    }
    interface UpdateTagOptions {
        tag: any;
        rename: any;
    }
    interface RemoveTagOptions {
        tag: any;
    }
}
export declare namespace Realtime {
    interface GetUserChannelOptions {
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
