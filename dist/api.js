export const assertResponseOk = (response) => {
    if (response.error) {
        throw new ApiError(response.error);
    }
};
export class ApiError extends Error {
    constructor(error) {
        super(error.message);
        this.type = 'ApiError';
        this.message = error.message;
        this.details = error.details;
        this.hint = error.hint;
        this.code = error.code;
    }
}
export const createApiClient = (supabase) => {
    const getComments = async ({ topic, parentId = null, }) => {
        const query = supabase
            .from('comments_with_metadata')
            .select('*,user:display_users!user_id(*),reactions_metadata:comment_reactions_metadata(*)')
            .eq('topic', topic)
            .order('created_at', { ascending: true });
        if (parentId) {
            query.eq('parent_id', parentId);
        }
        else {
            query.is('parent_id', null);
        }
        const response = await query;
        assertResponseOk(response);
        return response.data;
    };
    const getComment = async (id) => {
        const query = supabase
            .from('comments_with_metadata')
            .select('*,user:display_users!user_id(*),reactions_metadata:comment_reactions_metadata(*)')
            .eq('id', id)
            .single();
        const response = await query;
        assertResponseOk(response);
        return response.data;
    };
    const addComment = async (payload) => {
        var _a;
        const query = supabase
            .from('comments')
            .insert(Object.assign(Object.assign({}, payload), { user_id: (_a = supabase.auth.user()) === null || _a === void 0 ? void 0 : _a.id }))
            .single();
        const response = await query;
        assertResponseOk(response);
        return response.data;
    };
    const updateComment = async (id, payload) => {
        const query = supabase
            .from('comments')
            .update(payload)
            .match({ id })
            .single();
        const response = await query;
        assertResponseOk(response);
        return response.data;
    };
    const deleteComment = async (id) => {
        const query = supabase.from('comments').delete().match({ id }).single();
        const response = await query;
        assertResponseOk(response);
        return response.data;
    };
    const getReactions = async () => {
        const query = supabase
            .from('reactions')
            .select('*')
            .order('type', { ascending: true });
        const response = await query;
        assertResponseOk(response);
        return response.data;
    };
    const getReaction = async (type) => {
        const query = supabase
            .from('reactions')
            .select('*')
            .eq('type', type)
            .single();
        const response = await query;
        assertResponseOk(response);
        return response.data;
    };
    const getCommentReactions = async ({ reaction_type, comment_id, }) => {
        const query = supabase
            .from('comment_reactions')
            .select('*,user:display_users!user_id(*)')
            .eq('comment_id', comment_id)
            .eq('reaction_type', reaction_type);
        const response = await query;
        assertResponseOk(response);
        return response.data;
    };
    const addCommentReaction = async (payload) => {
        var _a;
        const query = supabase
            .from('comment_reactions')
            .insert(Object.assign(Object.assign({}, payload), { user_id: (_a = supabase.auth.user()) === null || _a === void 0 ? void 0 : _a.id }))
            .single();
        const response = await query;
        assertResponseOk(response);
        return response.data;
    };
    const removeCommentReaction = async ({ reaction_type, comment_id, }) => {
        var _a;
        const query = supabase
            .from('comment_reactions')
            .delete({ returning: 'representation' })
            .match({ reaction_type, comment_id, user_id: (_a = supabase.auth.user()) === null || _a === void 0 ? void 0 : _a.id })
            .single();
        const response = await query;
        assertResponseOk(response);
        return response.data;
    };
    const searchUsers = async (search) => {
        const query = supabase
            .from('display_users')
            .select('*')
            .ilike('name', `%${search}%`)
            .limit(5);
        const response = await query;
        assertResponseOk(response);
        return response.data;
    };
    const getUser = async (id) => {
        const query = supabase
            .from('display_users')
            .select('*')
            .eq('id', id)
            .single();
        const response = await query;
        assertResponseOk(response);
        return response.data;
    };
    return {
        getComments,
        getComment,
        addComment,
        updateComment,
        deleteComment,
        getReactions,
        getReaction,
        getCommentReactions,
        addCommentReaction,
        removeCommentReaction,
        searchUsers,
        getUser,
    };
};
