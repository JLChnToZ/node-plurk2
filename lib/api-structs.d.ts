export declare namespace APIStructs {
    const enum YesNo {
        no = 0,
        yes = 1
    }
    const enum BirthdayPrivacy {
        hideAll = 0,
        hideYear = 1,
        showAll = 2
    }
    const enum Gender {
        female = 0,
        male = 1,
        notStatingOrOther = 2
    }
    const enum Relationship {
        notSaying = "not_saying",
        single = "single",
        married = "married",
        divorced = "divorced",
        engaged = "engaged",
        inRelationship = "in_relationship",
        complicated = "complicated",
        widowed = "widowed",
        unstableRelationship = "unstable_relationship",
        openRelationship = "open_relationship"
    }
    const enum CommentableState {
        unlimited = 0,
        disabledComments = 1,
        friendsOnly = 2
    }
    interface User {
        id: number;
        nick_name: string;
        display_name: string;
        premium: YesNo;
        has_profile_image: YesNo;
        avatar: string | null;
        location: string;
        default_lang: string;
        date_of_birth: Date;
        bday_privacy: BirthdayPrivacy;
        full_name: string;
        gender: Gender;
        karma: number;
        recruited: number;
        relationship: Relationship;
    }
    interface Entry {
        id: number;
        plurk_id: number;
        user_id: number;
        user?: User;
        lang: string;
        posted: Date;
        last_edited: Date | null;
        qualifier: string;
        qualifier_translated: string;
        content: string;
        content_raw: string;
    }
    interface Plurk extends Entry {
        owner_id: number;
        owner?: User;
        is_unread: YesNo;
        no_comments: CommentableState;
        plurk_type: number;
        response_count: number;
        responses_seen: number;
        limited_to: number[] | null;
        limited_to_data?: User[];
        favorite: boolean;
        favorite_count: number;
        favorers: number[];
        favorers_data?: User[];
        replurkable: boolean;
        replurked: boolean;
        replurker_id: number;
        replurker?: User;
        replurkers_count: number;
        replurkers: number[];
        replurkers_data?: User[];
    }
    interface Response extends Entry {
    }
    const enum AlertType {
        friendshipRequest = "friendship_request",
        friendshipPending = "friendship_pending",
        newFan = "new_fan",
        friendshipAccepted = "friendship_accepted",
        newFriend = "new_friend",
        privatePlurk = "private_plurk",
        plurkLiked = "plurk_liked",
        plurkReplurked = "plurk_replurked",
        mentioned = "mentioned",
        myResponded = "my_responded"
    }
    interface Alert {
        type: AlertType;
    }
    interface MentionedAlert extends Alert {
        type: AlertType.mentioned;
        from_user: User;
        posted: Date;
        plurk_id: number;
        num_others: number;
        response_id: number | null;
    }
}
