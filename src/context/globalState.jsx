import React, { createContext, useState, useEffect } from "react";
import api from "@/services/api";

// Create context
export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user from localStorage
        const userData = JSON.parse(localStorage.getItem("userData"));
        const role = localStorage.getItem("userRole");
        setUser(userData);

        // Set default units with Sinhala labels as values
        setUnits([
          {
            label: "මිනුම්",
            value: "මිනුම්",
            subunits: [
              {
                label: "ඒකක හා මාන",
                value: "ඒකක හා මාන",
                _id: "68b6fcdd33dcbc8bb2770ec7",
              },
              {
                label: "මිනුම් උපකරණ",
                value: "මිනුම් උපකරණ",
                _id: "68b6fcdd33dcbc8bb2770ec8",
              },
            ],
            _id: "68b6f3ce63e8d9b1a21c4331",
          },
          {
            label: "යාන්ත්‍ර විද්‍යාව",
            value: "යාන්ත්‍ර විද්‍යාව",
            subunits: [
              {
                label: "චලිතය",
                value: "චලිතය",
                _id: "68b6fcdd33dcbc8bb2770ec7",
              },
              {
                label: "නිව්ටන් නියම හ ගම්‍යතාවය",
                value: "නිව්ටන් නියම හ ගම්‍යතාවය",
                _id: "68b6fcdd33dcbc8bb2770ec8",
              },
              {
                label: "බල සමතුලිතතාව",
                value: "බල සමතුලිතතාව",
                _id: "68b6fcdd33dcbc8bb2770ec9",
              },
              {
                label: "ගුරුත්ව කේන්ද්‍රය",
                value: "ගුරුත්ව කේන්ද්‍රය",
                _id: "68b6fcdd33dcbc8bb2770eca",
              },
              {
                label: "ඝර්ෂණය",
                value: "ඝර්ෂණය",
                _id: "68b6fcdd33dcbc8bb2770ecb",
              },
              {
                label: "කාර්යය හා ශක්තිය",
                value: "කාර්යය හා ශක්තිය",
                _id: "68b6fcdd33dcbc8bb2770ecc",
              },
              {
                label: "වෘත්ත චලිතය",
                value: "වෘත්ත චලිතය",
                _id: "68b6fcdd33dcbc8bb2770ece",
              },
              {
                label: "ද්‍රව ස්ථිතිය",
                value: "ද්‍රව ස්ථිතිය",
                _id: "68b6fcdd33dcbc8bb2770ecf",
              },
              {
                label: "බර්නූලි ප්‍රමේයය",
                value: "බර්නූලි ප්‍රමේයය",
                _id: "68b6fcdd33dcbc8bb2770ed0",
              },
            ],
            _id: "68b6fcdd33dcbc8bb2770ec6",
          },
          {
            label: "දෝලන හා තරංග",
            value: "දෝලන හා තරංග",
            subunits: [
              {
                label: "සරල අනුවර්ති චලිතය",
                value: "සරල අනුවර්ති චලිතය",
                _id: "68b6fd3d33dcbc8bb2770eed",
              },
              {
                label: "තරංග ගුණ",
                value: "තරංග ගුණ",
                _id: "68b6fd3d33dcbc8bb2770eee",
              },
              {
                label: "උපරිතාන",
                value: "උපරිතාන",
                _id: "68b6fd3d33dcbc8bb2770eef",
              },
              {
                label: "ධවනි ප්‍රවේගය",
                value: "ධවනි ප්‍රවේගය",
                _id: "68b6fd3d33dcbc8bb2770ef0",
              },
              {
                label: "ඩොප්ලර් ආචරනය",
                value: "ඩොප්ලර් ආචරනය",
                _id: "68b6fd3d33dcbc8bb2770ef1",
              },
              {
                label: "ධ්වනි තීව්‍රතාවය",
                value: "ධ්වනි තීව්‍රතාවය",
                _id: "68b6fd3d33dcbc8bb2770ef2",
              },
            ],
            _id: "68b6fd3d33dcbc8bb2770eec",
          },
          {
            label: "ආලෝකය",
            value: "ආලෝකය",
            subunits: [
              {
                label: "අලෝක කිරණ වර්තනය",
                value: "අලෝක කිරණ වර්තනය",
                _id: "68b6fe2233dcbc8bb2770f1d",
              },
              {
                label: "ප්‍රිස්ම තුලින් වර්තනය",
                value: "ප්‍රිස්ම තුලින් වර්තනය",
                _id: "68b6fe2233dcbc8bb2770f1e",
              },
               {
                label: "ලේසර්",
                value: "ලේසර්",
                _id: "68b6fe2233dcbc8bb2770f2z",
              },
              {
                label: "කාච තුලින් වර්තනය",
                value: "කාච තුලින් වර්තනය",
                _id: "68b6fe2233dcbc8bb2770f1f",
              },
              {
                label: "අක්ශි දෝශ",
                value: "අක්ශි දෝශ",
                _id: "68b6fe2233dcbc8bb2770f20",
              },
              {
                label: "ප්‍රකාශ උපකරණ",
                value: "ප්‍රකාශ උපකරණ",
                _id: "68b6fe2233dcbc8bb2770f21",
              },
            ],
            _id: "68b6fe2233dcbc8bb2770f1c",
          },
          {
            label: "තාපය",
            value: "තාපය",
            subunits: [
              {
                label: "උෂ්ණත්වමිතිය",
                value: "උෂ්ණත්වමිතිය",
                _id: "68b700f333dcbc8bb2770f3e",
              },
              {
                label: "ප්‍රසාරණය",
                value: "ප්‍රසාරණය",
                _id: "68b700f333dcbc8bb2770f3f",
              },
              {
                label: "තාප මිතිය",
                value: "තාප මිතිය",
                _id: "68b700f333dcbc8bb2770f40",
              },
              {
                label: "තාප ගතිය",
                value: "තාප ගතිය",
                _id: "68b700f333dcbc8bb2770f41",
              },
              {
                label: "වාෂ්ප හා අර්ද්‍රතාවය",
                value: "වාෂ්ප හා අර්ද්‍රතාවය",
                _id: "68b700f333dcbc8bb2770f42",
              },
              {
                label: "තාප සන්නයනය",
                value: "තාප සන්නයනය",
                _id: "68b700f333dcbc8bb2770f43",
              },
              {
                label: "තාප සංවහනය",
                value: "තාප සංවහනය",
                _id: "68b700f333dcbc8bb2770f44",
              },
            ],
            _id: "68b700f333dcbc8bb2770f3d",
          },
          {
            label: "ධාරා විද්‍යුතය",
            value: "ධාරා විද්‍යුතය",
            subunits: [
              {
                label: "ඕම් නියමය",
                value: "ඕම් නියමය",
                _id: "68b7013d33dcbc8bb2770f69",
              },
              {
                label: "විද්‍යුත් ක්ෂමතාවය හා තාපන පලය",
                value: "විද්‍යුත් ක්ෂමතාවය හා තාපන පලය",
                _id: "68b7013d33dcbc8bb2770f6a",
              },
              {
                label: "කර්චොප් නියම හා කෝශ පද්ධති",
                value: "කර්චොප් නියම හා කෝශ පද්ධති",
                _id: "68b7013d33dcbc8bb2770f6b",
              },
              {
                label: "මීටර් සේතූ හා වින්ස්ටන් සේතූ",
                value: "මීටර් සේතූ හා වින්ස්ටන් සේතූ",
                _id: "68b7013d33dcbc8bb2770f6c",
              },
              {
                label: "සල දගර මීටර",
                value: "සල දගර මීටර",
                _id: "68b7013d33dcbc8bb2770f6d",
              },
              {
                label: "විද්‍යුත චුම්බක ප්‍රේරණය",
                value: "විද්‍යුත චුම්බක ප්‍රේරණය",
                _id: "68b7013d33dcbc8bb2770f6e",
              },
            ],
            _id: "68b7013d33dcbc8bb2770f68",
          },
          {
            label: "ඉලෙක්ට්‍රොනික විද්‍යාව",
            value: "ඉලෙක්ට්‍රොනික විද්‍යාව",
            subunits: [
              {
                label: "අර්ධ සන්නායක හා සන්ධි ඩයෝඩ",
                value: "අර්ධ සන්නායක හා සන්ධි ඩයෝඩ",
                _id: "68b7016533dcbc8bb2770f9a",
              },
              {
                label: "ට්‍රාන්සිස්ටර",
                value: "ට්‍රාන්සිස්ටර",
                _id: "68b7016533dcbc8bb2770f9b",
              },
              {
                label: "සංගෘහිත පරිපථ",
                value: "සංගෘහිත පරිපථ",
                _id: "68b7016533dcbc8bb2770f9c",
              },
              {
                label: "තාර්කික ද්වාර",
                value: "තාර්කික ද්වාර",
                _id: "68b7016533dcbc8bb2770f9d",
              },
            ],
            _id: "68b7016533dcbc8bb2770f99",
          },
          {
            label: "ක්ෂේත්‍ර",
            value: "ක්ෂේත්‍ර",
            subunits: [
              {
                label: "චුම්බක ක්ෂේත්‍ර",
                value: "චුම්බක ක්ෂේත්‍ර",
                _id: "68b7018f33dcbc8bb2771a01",
              },
              {
                label: "ගුරුත්වාකර්ෂණ ක්ෂේත්‍ර",
                value: "ගුරුත්වාකර්ෂණ ක්ෂේත්‍ර",
                _id: "68b7018f33dcbc8bb2771a02",
              },
              {
                label: "විද්‍යුත් ක්ෂේත්‍ර",
                value: "විද්‍යුත් ක්ෂේත්‍ර",
                _id: "68b7018f33dcbc8bb2771a03",
              },
            ],
            _id: "68b7018f33dcbc8bb2771a00",
          },

          {
            label: "පදාර්ථයේ ගුණ",
            value: "පදාර්ථයේ ගුණ",
            subunits: [
              {
                label: "ප්‍රත්‍යස්ථාව",
                value: "ප්‍රත්‍යස්ථාව",
                _id: "68b7018f33dcbc8bb2770fce",
              },
              {
                label: "පෘශ්ටික ආතතිය",
                value: "පෘශ්ටික ආතතිය",
                _id: "68b7018f33dcbc8bb2770fcf",
              },
              {
                label: "දුස්සාවිතාව",
                value: "දුස්සාවිතාව",
                _id: "68b7018f33dcbc8bb2770fd0",
              },
            ],
            _id: "68b7018f33dcbc8bb2770fcd",
          },
          {
            label: "පාදාර්ථ හා විකිරණ",
            value: "පාදාර්ථ හා විකිරණ",
            subunits: [
              {
                label: "තාප විකිරණ",
                value: "තාප විකිරණ",
                _id: "68b701be33dcbc8bb2771005",
              },
              {
                label: "ප්‍රකාශ විද්‍යුත් ආචරණය",
                value: "ප්‍රකාශ විද්‍යුත් ආචරණය",
                _id: "68b701be33dcbc8bb2771006",
              },
              {
                label: "අංශු හා තරංග",
                value: "අංශු හා තරංග",
                _id: "68b701be33dcbc8bb2771007",
              },
              {
                label: "විකිරණශීලිතාවය",
                value: "විකිරණශීලිතාවය",
                _id: "68b701be33dcbc8bb2771008",
              },
            ],
            _id: "68b701be33dcbc8bb2771004",
          },
        ]);

        // Fetch general data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        theme,
        setTheme,

        units,
        setUnits,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalProvider;
