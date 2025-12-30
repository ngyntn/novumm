class AdminUserDTO {
    constructor({ id, name, email, role, is_active }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.is_active = is_active;
    }
}

module.exports = { AdminUserDTO };