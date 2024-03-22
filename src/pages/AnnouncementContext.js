import React, { createContext, useContext, useState } from 'react';

const AnnouncementContext = createContext();

export const useAnnouncement = () => useContext(AnnouncementContext);

export const AnnouncementProvider = ({ children }) => {
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);

    return (
        <AnnouncementContext.Provider value={{ currentAnnouncement, setCurrentAnnouncement }}>
            {children}
        </AnnouncementContext.Provider>
    );
};
