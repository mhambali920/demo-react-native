import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import axiosInstance from "@/lib/axiosInstance";
import { useAuthSession } from "@/providers/AuthProvider";
import { z } from "zod";
import { useState } from "react";
import {
  Button,
  TextInput,
  Alert,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export default function Login() {
  const { signIn } = useAuthSession();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const handleChange = (field: "email" | "password", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined })); // Clear error on change
  };

  const login = async () => {
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    try {
      const res = await axiosInstance.post("/login", form);
      signIn(res.data.access_token, res.data.user);
    } catch (error: any) {
      console.log(error);
      Alert.alert(
        "Login Gagal",
        error.response?.data?.message || "Terjadi kesalahan"
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.inputGroup}>
        <ThemedText style={styles.label}>Email</ThemedText>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </ThemedView>

      <ThemedView style={styles.inputGroup}>
        <ThemedText style={styles.label}>Password</ThemedText>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          secureTextEntry
        />
        {errors.password && (
          <ThemedText style={styles.errorText}>{errors.password}</ThemedText>
        )}
      </ThemedView>

      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  inputError: {
    borderColor: "#e53935",
    backgroundColor: "#fff5f5",
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: "#e53935",
  },
  button: {
    backgroundColor: "#1e88e5",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
