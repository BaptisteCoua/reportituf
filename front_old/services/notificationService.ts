import useNotifications from '~/resources/useNotifications';

export default function notificationService() {
  const notificationResource = useNotifications();

  const getUnread = async () => {
    const result = await notificationResource.search({
      filters: [
        {
          field: 'read_at',
          //@ts-ignore
          value: null,
        },
      ],
      includes: [
        {
          relation: 'user',
        },
      ],
    });
    return result.data;
  };

  const markAsRead = async (id: string) => {
    const result = await notificationResource.actions(
      'mark-notification-as-read',
      {
        search: {
          filters: [
            {
              field: 'id',
              value: id,
            },
          ],
        },
      }
    );
    return result;
  };

  return {
    getUnread,
    markAsRead,
  };
}
