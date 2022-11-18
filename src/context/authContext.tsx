import React, {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { auth, db } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import {
  getDoc,
  setDoc,
  doc,
  updateDoc,
  onSnapshot,
  collection,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

interface AuthContextInterface {
  activeStatus: string;
  setActiveStatus: React.Dispatch<React.SetStateAction<string>>;
  userState: {
    displayName: string;
    logIn: boolean;
    email: string;
    uid: string;
    name: string;
    onlineStatus: boolean;
    profileImage: string;
    savedArticles: string[];
    savedKeyWords: string[];
  };
  setUserState: Dispatch<
    SetStateAction<{
      logIn: boolean;
      email: string;
      uid: string;
      displayName: string;
      name: string;
      onlineStatus: boolean;
      profileImage: string;
      savedArticles: string[];
      savedKeyWords: string[];
    }>
  >;
  // showOnline: {
  //   logIn: boolean;
  //   email: string;
  //   uid: string;
  //   name: string;
  //   onlineStatus: boolean;
  // }[];
  // showOnline: boolean;

  isLoading: boolean;
  isLogIn: boolean;
  logOut(): void;
  sendLogIn(nowUser: { uid: string }): void;
  signInUserDoc(nowUser: User, nickName: string): void;
  signInRequest(
    active: string,
    email: string,
    password: string,
    nickName: string
  ): void;
  sendLogOut(): void;
}

export const AuthContext = createContext<AuthContextInterface>({
  activeStatus: "register",
  setActiveStatus: () => {},
  userState: {
    logIn: false,
    email: "",
    uid: "",
    name: "",
    displayName: "",
    onlineStatus: false,
    profileImage: "",
    savedArticles: [""],
    savedKeyWords: [""],
  },
  setUserState: () => {},
  // showOnline: [
  //   {
  //     logIn: false,
  //     email: "",
  //     uid: "",
  //     name: "",
  //     onlineStatus: false,
  //   },
  // ],
  // showOnline: false,
  // setShowOnline:()=>{},
  isLoading: false,
  isLogIn: false,
  logOut: () => {},
  sendLogIn: () => {},
  signInUserDoc: () => {},
  signInRequest: () => {},
  sendLogOut: () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeStatus, setActiveStatus] = useState("register");
  const [userState, setUserState] = useState({
    logIn: false,
    email: "",
    uid: "",
    name: "",
    displayName: "",
    onlineStatus: false,
    profileImage: "",
    savedArticles: [""],
    savedKeyWords: [""],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLogIn, setisLogIn] = useState<boolean>(false);
  // const [showOnline, setShowOnline] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      if (user) {
        setisLogIn(true);
        if (!user.uid) return;
        const getData: DocumentSnapshot<DocumentData> = await getDoc(
          doc(db, "users", user.uid)
        );

        setUserState({
          ...userState,
          logIn: true,
          email: getData.data()?.email,
          uid: getData.data()?.uid,
          displayName: getData.data()?.displayName,
          onlineStatus: getData.data()?.onlineStatus,
          profileImage: getData.data()?.profileImage,
          savedArticles: getData.data()?.savedArticles,
          savedKeyWords: getData.data()?.savedKeyWords,
        });
      } else {
        setUserState({
          ...userState,
          logIn: false,
          email: "",
          uid: "",
          displayName: "",
          onlineStatus: false,
          profileImage: "",
          savedArticles: [""],
          savedKeyWords: [""],
        });
        setIsLoading(false);
        setisLogIn(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function signInUserDoc(nowUser: User, nickName: string) {
    try {
      const userData: {
        email: string | null;
        uid: string;
        displayName: string;
      } = {
        email: nowUser.email,
        uid: nowUser.uid,
        displayName: nickName,
      };
      await setDoc(doc(db, "users", userData.uid), {
        email: userData.email,
        logIn: true,
        uid: userData.uid,
        displayName: nickName,
        onlineStatus: true,
        profileImage: "",
        savedArticles: [""],
        savedKeyWords: [""],
      });
    } catch (e) {
      console.error("signInUserDoc", e);
    }
  }

  async function sendLogIn(user: { uid: string }) {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        onlineStatus: true,
      });
    } catch (e) {
      console.error(e);
    }
  }

  function signInRequest(
    activeStatus: string,
    email: string,
    password: string,
    nickName: string
  ) {
    setIsLoading(true);
    if (activeStatus === "register") {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user: User = userCredential.user;
          signInUserDoc(user, nickName);
          setisLogIn(true);
        })
        .catch((error) => {
          alert("註冊失敗!");
          setIsLoading(false);
        });
    } else if (activeStatus === "signin") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user: User = userCredential.user;
          setisLogIn(true);
          sendLogIn(user);
          // setIsLoading(false);
        })
        .catch((error) => {
          alert("登入失敗!");
          console.log("signInRequest:signin", error);
          setIsLoading(false);
        });
    }
  }

  async function sendLogOut() {
    try {
      await updateDoc(doc(db, "users", userState.uid), {
        onlineStatus: false,
      });
    } catch (e) {
      console.error(e);
    }
  }

  function logOut() {
    signOut(auth);
    setIsLoading(false);
    setisLogIn(false);
    setUserState({
      ...userState,
      logIn: false,
      email: "",
      uid: "",
      displayName: "",
      onlineStatus: false,
      profileImage: "",
      savedArticles: [""],
      savedKeyWords: [""],
    });
    sendLogOut();
    console.log("logOut");
  }

  return (
    <AuthContext.Provider
      value={{
        activeStatus,
        setActiveStatus,
        userState,
        setUserState,
        isLoading,
        isLogIn,

        logOut,
        sendLogIn,
        sendLogOut,
        signInUserDoc,
        signInRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
