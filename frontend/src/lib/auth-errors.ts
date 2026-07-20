const errorMap: Record<string, string> = {
  "Invalid login credentials": "Неверная почта или пароль",
  "User already registered": "Аккаунт с этой почтой уже существует",
  "Password should be at least 6 characters.": "Пароль должен быть не короче 6 символов",
  "Password should be at least 6 characters": "Пароль должен быть не короче 6 символов",
  "Unable to validate email address: invalid format": "Проверьте формат почты",
  "Email not confirmed": "Почта не подтверждена. Проверьте входящие письма",
  "Signup requires a valid password": "Введите пароль",
  "missing email or phone": "Введите почту",
};

export function translateAuthError(message?: string | null): string {
  if (!message) {
    return "Не получилось выполнить действие. Попробуйте еще раз";
  }
  return errorMap[message] ?? "Не получилось. Проверьте данные и попробуйте еще раз";
}
