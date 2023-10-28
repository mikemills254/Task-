import { auth, Db } from "./Firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";
import { collection, addDoc, DocumentReference } from "firebase/firestore";

export const CreateAccount = {
    EmailandPassword: async (email: string, password: string, username: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const docID = await storeUserInfor(username, email, password);
        return {user, docID};
        } catch (error:any) {
            console.error("Sign in error:", error.code, error.message);
        throw error;
        }
    },
};

export const LogIn = {
    EmailandPassword: async (email: string, password: string) => {
        try {
            const results = await signInWithEmailAndPassword(auth, email, password);
            const user = results.user;
        return user;
        } catch (error:any) {
        console.log(error.message);
            return error.message;
        }
    },
};

export const ResetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email).then(() => {
        return { msg: 'Email sent' };
    });
};

const storeUserInfor = async (username: string, email: string, password: string): Promise<string> => {
    try {
        const docRef: DocumentReference = await addDoc(collection(Db, "Users"), {
        Username: username,
        Email: email,
        Password: password,
        });
        return docRef.id;
    } catch (error) {
        throw error;
    }
};
