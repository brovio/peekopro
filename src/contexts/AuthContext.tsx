import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  session: Session | null
  user: User | null
  isAuthenticated: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAuthenticated: false,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (!session) {
        navigate("/login")
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      navigate("/login")
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const value = {
    session,
    user,
    isAuthenticated: !!session,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}