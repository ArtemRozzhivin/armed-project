export const MIN_PASSWORD_CHARS = 8
export const MAX_PASSWORD_CHARS = 50

export const isValidEmail = text => text.match(/^\w+([.+-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,7})+$/)

export const isValidPassword = text => text.length >= MIN_PASSWORD_CHARS

export const isValidName = text => text.match(/^[A-Za-z0-9\s]{3,}$/)

