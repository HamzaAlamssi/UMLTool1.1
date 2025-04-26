package com.uml.tool.constants;

public enum UserRoles {
    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN");

    private final String roleName;
    public static UserRoles getEnumByValue(String value) {
        for (UserRoles userRole : UserRoles.values()) {
            if (userRole.getRoleName().equalsIgnoreCase(value)) {
                return userRole;
            }
        }
        return null;
    }

    private String getRoleName() {
        return roleName;
    }

    UserRoles(String role) {
        this.roleName = role;
    }
}
