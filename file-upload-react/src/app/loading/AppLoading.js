import './AppLoading.css'

export function AppLoading({ text }) {
    return <div className="loading">{text || "..."}</div>;
}