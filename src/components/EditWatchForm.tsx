"use client";

import { useActionState } from "react";
import { updateWatch } from "@/lib/actions/watches";
import { CONDITION_LABELS, type Watch } from "@/lib/types";

export function EditWatchForm({ watch }: { watch: Watch }) {
  const updateWatchWithId = updateWatch.bind(null, watch.id);
  const [state, formAction, pending] = useActionState(updateWatchWithId, undefined);

  return (
    <form action={formAction} style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e8e8", padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 }}>Marque</label>
          <input name="brand" required defaultValue={watch.brand} placeholder="Rolex"
            style={{ width: "100%", borderRadius: 10, border: "1.5px solid #e8e8e8", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 }}>Modèle</label>
          <input name="model" required defaultValue={watch.model} placeholder="Submariner"
            style={{ width: "100%", borderRadius: 10, border: "1.5px solid #e8e8e8", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 }}>Année</label>
          <input name="year" type="number" min={1900} max={2030} defaultValue={watch.year ?? ""} placeholder="2020"
            style={{ width: "100%", borderRadius: 10, border: "1.5px solid #e8e8e8", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 }}>État</label>
          <select name="condition" required defaultValue={watch.condition}
            style={{ width: "100%", borderRadius: 10, border: "1.5px solid #e8e8e8", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff" }}>
            {Object.entries(CONDITION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 }}>Ville</label>
          <input name="city" defaultValue={watch.city ?? ""} placeholder="Genève"
            style={{ width: "100%", borderRadius: 10, border: "1.5px solid #e8e8e8", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 }}>Pays</label>
          <input name="country" defaultValue={watch.country ?? ""} placeholder="Suisse"
            style={{ width: "100%", borderRadius: 10, border: "1.5px solid #e8e8e8", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 }}>Description</label>
        <textarea name="description" rows={3} defaultValue={watch.description ?? ""} placeholder="Détails, accessoires inclus, raison de l'échange..."
          style={{ width: "100%", borderRadius: 10, border: "1.5px solid #e8e8e8", padding: "10px 14px", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 }}>Prix d&apos;achat</label>
          <input name="purchase_price" type="number" min={0} step="100" defaultValue={watch.purchase_price ?? ""} placeholder="32000"
            style={{ width: "100%", borderRadius: 10, border: "1.5px solid #e8e8e8", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 }}>Devise</label>
          <select name="currency" defaultValue={watch.currency}
            style={{ width: "100%", borderRadius: 10, border: "1.5px solid #e8e8e8", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff" }}>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="CHF">CHF</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 10 }}>Provenance et authenticité</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { name: "has_proof_of_purchase", label: "Preuve d'achat", checked: watch.has_proof_of_purchase },
            { name: "has_certificate_authenticity", label: "Certificat d'authenticité", checked: watch.has_certificate_authenticity },
            { name: "has_box", label: "Boîte d'origine", checked: watch.has_box },
            { name: "has_papers", label: "Papiers / garantie", checked: watch.has_papers },
          ].map(({ name, label, checked }) => (
            <label key={name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, borderRadius: 10, border: "1.5px solid #e8e8e8", padding: "10px 12px", cursor: "pointer" }}>
              <input type="checkbox" name={name} defaultChecked={checked} style={{ accentColor: "#e8445a" }} /> {label}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 }}>Ajouter des photos (jusqu&apos;à 5)</label>
        <input name="photos" type="file" accept="image/*" multiple
          style={{ width: "100%", borderRadius: 10, border: "1.5px dashed #e8e8e8", padding: "12px 14px", fontSize: 13, boxSizing: "border-box" }} />
        {watch.photos?.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {watch.photos.map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={p} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, border: "1px solid #e8e8e8" }} />
            ))}
          </div>
        )}
      </div>

      {state?.error && (
        <div style={{ background: "#fff0f2", border: "1px solid #ffd0d0", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#e8445a" }}>
          {state.error}
        </div>
      )}

      <button type="submit" disabled={pending}
        style={{ width: "100%", background: "#e8445a", color: "#fff", fontWeight: 700, borderRadius: 12, padding: "14px 0", fontSize: 15, border: "none", cursor: "pointer", opacity: pending ? 0.6 : 1, boxShadow: "0 4px 12px rgba(232,68,90,0.3)" }}>
        {pending ? "Enregistrement..." : "Enregistrer les modifications"}
      </button>
    </form>
  );
}
