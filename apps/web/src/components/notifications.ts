import { notifications } from "@mantine/notifications";

export const showSuccessNotification = (message: string) => {
  notifications.show({
    title: "Success",
    message,
    color: "green",
  });
};
