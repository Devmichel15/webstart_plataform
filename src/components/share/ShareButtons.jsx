import { Download, MessageCircle, Music2 } from 'lucide-react'
import { Button } from '../ui/Button'
import {
  downloadShareCardImage,
  renderShareCardToCanvas,
} from '../../utils/shareUtils'
import { useToast } from '../../contexts/ToastContext'

export function ShareButtons({ shareData, className = '' }) {
  const { showSuccess } = useToast()

  const downloadAndRedirect = (url) => {
    const canvas = renderShareCardToCanvas(shareData)
    downloadShareCardImage(canvas)
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleWhatsApp = () => {
    downloadAndRedirect(`https://wa.me/?text=${encodeURIComponent('Conquista WebStart! 🚀')}`)
    showSuccess('Imagem baixada! Publique no WhatsApp.')
  }

  const handleInstagram = () => {
    downloadAndRedirect('https://instagram.com')
    showSuccess('Imagem baixada! Publique no Instagram.')
  }

  const handleTikTok = () => {
    downloadAndRedirect('https://tiktok.com/upload?lang=pt-BR')
    showSuccess('Imagem baixada! Publique no TikTok.')
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button variant="secondary" size="sm" onClick={handleWhatsApp} className="!border-green-600 !text-green-700 dark:!text-green-400">
        <MessageCircle size={16} />
        WhatsApp
      </Button>
      <Button variant="secondary" size="sm" onClick={handleInstagram} className="!border-pink-600 !text-pink-700 dark:!text-pink-400">
        <Download size={16} />
        Instagram Story
      </Button>
      <Button variant="secondary" size="sm" onClick={handleTikTok} className="!border-zinc-800 !text-zinc-800 dark:!text-zinc-200">
        <Music2 size={16} />
        TikTok
      </Button>
    </div>
  )
}
