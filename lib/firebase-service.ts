import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore"
import { db } from "./firebase"

// Company registration interface
export interface CompanyRegistration {
  id?: string
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  cep: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  municipio: string
  estado: string
  telefone: string
  email: string
  setor: string
  cargo: string
  departamento: string
  celular: string
  servicos: string[]
  acaoDeseja: string
  produtos: string[]
  createdAt: Date
  updatedAt: Date
}

// User interface
export interface User {
  id?: string
  email: string
  phone: string
  name: string
  role: string
  companyId?: string
  createdAt: Date
  lastLogin: Date
}

// Firebase service class
export class FirebaseService {
  // Company operations
  static async createCompany(data: Omit<CompanyRegistration, "id" | "createdAt" | "updatedAt">) {
    try {
      const docRef = await addDoc(collection(db, "companies"), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating company:", error)
      throw error
    }
  }

  static async getCompanies() {
    try {
      const querySnapshot = await getDocs(collection(db, "companies"))
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CompanyRegistration[]
    } catch (error) {
      console.error("Error getting companies:", error)
      throw error
    }
  }

  static async getCompanyByCNPJ(cnpj: string) {
    try {
      const q = query(collection(db, "companies"), where("cnpj", "==", cnpj))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return null
      }

      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
      } as CompanyRegistration
    } catch (error) {
      console.error("Error getting company by CNPJ:", error)
      throw error
    }
  }

  static async updateCompany(id: string, data: Partial<CompanyRegistration>) {
    try {
      const docRef = doc(db, "companies", id)
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error("Error updating company:", error)
      throw error
    }
  }

  static async deleteCompany(id: string) {
    try {
      await deleteDoc(doc(db, "companies", id))
    } catch (error) {
      console.error("Error deleting company:", error)
      throw error
    }
  }

  // User operations
  static async createUser(data: Omit<User, "id" | "createdAt" | "lastLogin">) {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        ...data,
        createdAt: new Date(),
        lastLogin: new Date(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  }

  static async getUserByEmail(email: string) {
    try {
      const q = query(collection(db, "users"), where("email", "==", email))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return null
      }

      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
      } as User
    } catch (error) {
      console.error("Error getting user by email:", error)
      throw error
    }
  }

  static async updateUserLastLogin(id: string) {
    try {
      const docRef = doc(db, "users", id)
      await updateDoc(docRef, {
        lastLogin: new Date(),
      })
    } catch (error) {
      console.error("Error updating user last login:", error)
      throw error
    }
  }
}
