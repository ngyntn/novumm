const { UserResponseDTO } = require("./user.dto");

class LoginDTO {
    constructor({ accessToken, refreshToken, user }) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        // tái sử dụng UserResponseDTO
        this.user = new UserResponseDTO(user);
    }
}

class RefreshTokenDTO {
    constructor({ accessToken }) {
        this.accessToken = accessToken;
    }
}
module.exports = {
    LoginDTO,
    RefreshTokenDTO
};