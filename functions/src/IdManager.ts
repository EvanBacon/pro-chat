export function isValidUserId(key: string): boolean {
  return key && typeof key === 'string' && key !== '';
}

export function getOtherUserIDsFromChatGroupId(
  groupId: string,
  omitTargetId: string,
): string[] {
  if (!isValidUserId(groupId)) {
    console.log('getOtherUsersFromChatGroup: Invalid group id', { groupId });
    return [];
  }

  // Remove self from group...

  const userIDs = groupId.split('_');
  if (userIDs.length < 2) {
    return [userIDs[1]];
  }

  const index = userIDs.indexOf(omitTargetId);
  if (index > -1) {
    userIDs.splice(index, 1);
  }
  return userIDs;
}
