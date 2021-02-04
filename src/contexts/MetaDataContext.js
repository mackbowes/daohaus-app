import React, {
  useContext,
  useState,
  createContext,
  useEffect,
  useRef,
} from 'react';

import { useParams } from 'react-router-dom';
import { fetchMetaData } from '../utils/metadata';

import { useCustomTheme } from './CustomThemeContext';
import { useUser } from './UserContext';

export const MetaDataContext = createContext();

export const MetaDataProvider = ({ children }) => {
  const { userHubDaos, refetchUserHubDaos } = useUser();
  const { updateTheme, resetTheme } = useCustomTheme();
  const { daoid, daochain } = useParams();

  const [customCopy, setCustomCopy] = useState(null);
  const [daoMetaData, setDaoMetaData] = useState(null);
  const [apiMetaData, setApiMetaData] = useState(null);

  const hasFetchedMetadata = useRef(false);
  const shouldUpdateTheme = useRef(true);

  useEffect(() => {
    if (userHubDaos) {
      const daoMeta = userHubDaos
        ?.find((network) => network.networkID === daochain)
        ?.data.find((dao) => {
          return dao.meta?.contractAddress === daoid;
        })?.meta;

      setDaoMetaData(daoMeta);
    }
  }, [userHubDaos, daochain, daoid]);

  useEffect(() => {
    if (daoMetaData?.customTheme && shouldUpdateTheme.current) {
      updateTheme(daoMetaData.customTheme);
      console.log('HUB UPDATE FIRST');
      if (daoMetaData?.customTheme?.daoMeta) {
        setCustomCopy({
          ...daoMetaData.customTheme.daoMeta,
          name: daoMetaData.name,
        });
      }
      shouldUpdateTheme.current = false;
    } else {
      resetTheme();
    }
  }, [daoMetaData]);

  useEffect(() => {
    const getApiMetadata = async () => {
      try {
        const data = await fetchMetaData(daoid);
        setApiMetaData(data);
        if (shouldUpdateTheme.current && data?.boosts?.length) {
          console.log('API UPDATE FIRST');

          const boosts = data.boosts;
          const customThemeDao = boosts.find(
            (boost) => boost.boostKey[0] === 'customTheme',
          );
          if (customThemeDao) {
            console.log(customThemeDao.boostMetadata);
            updateTheme(customThemeDao.boostMetadata);
            if (customThemeDao?.boostMetadata?.daoMeta) {
              setCustomCopy(customThemeDao?.boostMetadata?.daoMeta);
            }
            shouldUpdateTheme.current = false;
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (daoid) {
      getApiMetadata();
    }
  }, [daoid]);

  const fetchApiMetadata = async () => {
    try {
      const data = await fetchMetaData(daoid);
      setApiMetaData(data);
      if (shouldUpdateTheme.current && data?.boosts?.length) {
        const boosts = data.boosts;
        const customThemeDao = boosts.find(
          (boost) => boost.boostKey[0] === 'customTheme',
        );
        if (customThemeDao) {
          updateTheme(customThemeDao.boostMetadata);
          if (customThemeDao?.boostMetadata?.daoMeta) {
            setCustomCopy(customThemeDao?.boostMetadata?.daoMeta);
          }
          shouldUpdateTheme.current = false;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const refetchMetaData = () => {
    shouldUpdateTheme.current = true;
    fetchApiMetadata();
    refetchUserHubDaos();
  };

  return (
    <MetaDataContext.Provider
      value={{
        daoMetaData,
        customCopy,
        hasFetchedMetadata,
        shouldUpdateTheme,
        apiMetaData,
        refetchMetaData,
      }}
    >
      {children}
    </MetaDataContext.Provider>
  );
};

export const useMetaData = () => {
  const {
    daoMetaData,
    hasFetchedMetadata,
    shouldUpdateTheme,
    customCopy,
    apiMetaData,
    refetchMetaData,
  } = useContext(MetaDataContext);
  return {
    daoMetaData,
    hasFetchedMetadata,
    shouldUpdateTheme,
    customCopy,
    apiMetaData,
    refetchMetaData,
  };
};
