// Get user initials for fallback avatar
export const getUserInitials = (user) => {
  if (!user?.name) return ''
  return user.name.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}
