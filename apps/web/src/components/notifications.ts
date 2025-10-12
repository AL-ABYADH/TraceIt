import { notifications } from "@mantine/notifications";

export const showSuccessNotification = (message: string) => {
  notifications.show({
    title: "Success",
    message,
    color: "green",
  });
};

export const showErrorNotification = (message: string, title: string = "Error") => {
  notifications.show({
    title,
    message,
    color: "red",
    autoClose: 4000,
    styles: () => ({
      root: {
        backgroundColor: "var(--card)",
        color: "var(--foreground)",
        border: `1px solid var(--border)`,
        minWidth: "300px",
      },
      title: { color: "var(--destructive-foreground)" },
      description: { color: "var(--foreground)" },
    }),
  });
};
