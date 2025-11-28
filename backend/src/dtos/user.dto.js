class UserResponseDTO {
    constructor({ id, fullName, email, bio, avatarUrl, role, totalFollowers, totalFollowing, totalArticleLikes }) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.bio = bio || null;
        this.avatarUrl = avatarUrl || null;
        this.role = role;
        this.totalFollowers = totalFollowers || 0;
        this.totalFollowing = totalFollowing || 0;
        this.totalArticleLikes = totalArticleLikes || 0;
    }
}

class UserSummaryDTO {
    constructor({ id, fullName, avatarUrl }) {
        this.id = id;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl || null;
    }
}

class ListUserDTO {
    constructor(users, nextCursor) {
        this.users = users;
        this.nextCursor = nextCursor;
    }
}

class PaginationDTO {
    constructor(query) {
        this.limit = query.limit && query.limit !== '0' ? parseInt(query.limit) : undefined;
        this.cursor = query.cursor && query.cursor !== '0' ? parseInt(query.cursor) : undefined;
        this.search = query.search && query.search.trim() !== '' ? query.search.trim() : undefined;
    }
}
module.exports = {
    UserResponseDTO,
    UserSummaryDTO,
    ListUserDTO,
    PaginationDTO
};