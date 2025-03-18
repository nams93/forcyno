import { NextResponse } from "next/server"

// Cette fonction doit être implémentée côté serveur pour des raisons de sécurité
// Elle utilise les identifiants Azure AD pour obtenir un token d'accès
async function getPowerBIAccessToken() {
  try {
    // Dans un environnement de production, vous utiliseriez MSAL ou une autre bibliothèque
    // pour obtenir un token d'accès à partir de vos identifiants Azure AD

    // Exemple simplifié (NE PAS UTILISER EN PRODUCTION)
    // Vous devriez utiliser des variables d'environnement pour ces valeurs
    const tenantId = process.env.AZURE_TENANT_ID
    const clientId = process.env.AZURE_CLIENT_ID
    const clientSecret = process.env.AZURE_CLIENT_SECRET

    const url = `https://login.microsoftonline.com/${tenantId}/oauth2/token`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId!,
        client_secret: clientSecret!,
        resource: "https://analysis.windows.net/powerbi/api",
      }),
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de l'obtention du token: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      accessToken: data.access_token,
      expiry: new Date(Date.now() + data.expires_in * 1000).toISOString(),
    }
  } catch (error) {
    console.error("Erreur lors de l'obtention du token Power BI:", error)
    throw error
  }
}

export async function GET() {
  try {
    // Vérifier si les variables d'environnement sont configurées
    if (!process.env.AZURE_TENANT_ID || !process.env.AZURE_CLIENT_ID || !process.env.AZURE_CLIENT_SECRET) {
      return NextResponse.json({ error: "Configuration Azure AD manquante" }, { status: 500 })
    }

    const tokenInfo = await getPowerBIAccessToken()

    return NextResponse.json(tokenInfo)
  } catch (error) {
    console.error("Erreur dans la route API Power BI:", error)
    return NextResponse.json({ error: "Impossible d'obtenir un token d'accès" }, { status: 500 })
  }
}

