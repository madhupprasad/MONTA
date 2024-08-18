export interface SiderButton {
  systemName: string;
  displayName: string;
}

export interface NotesLocker {
  id: string;
  title: string;
}

export interface SiderButtonList {
  buttons: SiderButton[];
}

export interface NotesLockerList {
  lockers: NotesLocker[];
}

export const siderButtonList: SiderButtonList = {
  buttons: [
    {
      systemName: "home",
      displayName: "H",
    },
    {
      systemName: "settings",
      displayName: "S",
    },
  ],
};

export const notesLockerList: NotesLockerList = {
  lockers: [
    {
      id: "1",
      title: "Locker 1",
    },
    {
      id: "2",
      title: "Locker 2",
    },
    {
      id: "3",
      title: "Locker 3",
    },
    {
      id: "4",
      title: "Locker 4",
    },
  ],
};
