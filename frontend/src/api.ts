export async function ping() {
    const res = await fetch("/api/hello"); // przejdzie przez proxy do :8080
    if (!res.ok) throw new Error("API error");
    return res.json() as Promise<{ message: string }>;
}
