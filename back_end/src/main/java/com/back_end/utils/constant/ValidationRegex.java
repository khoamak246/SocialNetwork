package com.back_end.utils.constant;

public final class ValidationRegex {

        public static final String INVALID_MESSAGE = "Miss matcher data!";
        public static final String FULL_NAME_REGEX = "^([A-za-z]+\\s)+[a-zA-z]+$";
        public static final String USER_NAME_REGEX = "(^[a-zA-z0-9]{6,30}$)|(^[0-9]{10}$)";
        public static final String PHONE_NUMBER_REGEX = "^[0-9]{10}$";
        public static final String EMAIL_REGEX = "[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
        public static final String PASSWORD_REGEX = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{6,}$";
        public static final String NUMBER_FORMAT_REGEX = "^[0-9]+$";
        public static final String LOGIN_USERNAME_REGEX = "(^[a-zA-z0-9]{6,30}$)|(^[0-9]{10}$)|([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)|(^[0-9]{10}$)";
        public static boolean isMatcherRegex(String regex, String value) {
                return value.matches(regex);
        }

}
