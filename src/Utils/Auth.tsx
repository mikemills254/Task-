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
        } catch (error) {
            console.error("Sign in error:", error);
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
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
};

export const Firestore = {
    AddDataToFirestore: async (topic: string, description: string, due_date: Date, category: string, email: string ) => {
        try{
            const results = await addDoc(collection(Db, 'Tasks'), {
                Topic: topic,
                Description: description,
                DueDate: due_date,
                Category: category,
                Email: email
            });
        return results
        } catch (error){
            console.error('Error adding task', error);
        }
    }
}

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
