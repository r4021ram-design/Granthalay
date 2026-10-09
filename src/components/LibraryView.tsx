import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  FileText,
  Download,
  Eye,
  Sparkles,
  Upload,
  Search,
  Filter,
  LayoutGrid,
  List,
  Layers,
  ArrowRight,
  Volume2,
  ChevronDown,
} from 'lucide-react';
import { HinduGranthalayLogo } from './HinduGranthalayLogo.js';
import { SingleUnifiedIndex } from './SingleUnifiedIndex.js';
import type { Book, BookStats } from '../../shared/types.js';
import {
  CANONICAL_DARSHANS,
  CANONICAL_DEITIES,
  CANONICAL_STOTRA_GENRES,
  DarshanId,
  getAllStotrasForDarshan,
  getDeityById,
  ScriptureItem,
  StotraGenreId,
  classifyStotraGenre,
  getBookDarshan,
} from '../data/darshanTaxonomy.js';
import { DeitySvgIcon } from './DeitySvgIcons.js';

interface LibraryViewProps {
  books: Book[];
  stats: BookStats | null;
  onSelectBookForVerification: (bookId: string) => void;
  onSelectBookForReading: (bookId: string, initialPage?: number, initialStotraId?: number | string) => void;
  onSelectCustomStotra?: (item: ScriptureItem) => void;
  onDeleteBook: (bookId: string) => void;
  onOpenUpload: () => void;
  onExport: (bookId: string, format: 'txt' | 'docx' | 'pdf') => void;
  activeDarshan?: DarshanId | 'all';
  onDarshanChange?: (darshan: DarshanId | 'all') => void;
}

interface DeityTheme {
  name: string;
  gradient: string;
  border: string;
  badge: string;
  glyph: string;
  mantra: string;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  books,
  stats,
  onSelectBookForVerification,
  onSelectBookForReading,
  onSelectCustomStotra,
  onDeleteBook,
  onOpenUpload,
  onExport,
  activeDarshan: controlledActiveDarshan,
  onDarshanChange,
}) => {
  const [internalActiveDarshan, setInternalActiveDarshan] = useState<DarshanId | 'all'>('stotra');
  const activeDarshan = controlledActiveDarshan !== undefined ? controlledActiveDarshan : internalActiveDarshan;
  const setActiveDarshan = (d: DarshanId | 'all') => {
    setInternalActiveDarshan(d);
    onDarshanChange?.(d);
  };
  const [stotraDeity, setStotraDeity] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<StotraGenreId>('all');
  const [stotraSearch, setStotraSearch] = useState('');
  const [stotraLayout, setStotraLayout] = useState<'unified' | 'grid' | 'compact'>('unified');
  const [refreshKey] = useState(0);

  // General Library Filter states (for 'all' or specific non-stotra darshans)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDeity, setSelectedDeity] = useState<string>('all');
  const [exportDropdown, setExportDropdown] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<DarshanId | null>(null);


  // Dropdown items definition for each of the 4 Darshans
  const darshanDropdownItems: Record<DarshanId, Array<{
    id: string;
    title: string;
    subtitle?: string;
    badge?: string;
    icon: string;
    action: () => void;
  }>> = useMemo(() => {
    return {
      stotra: [
        {
          id: 'brihat-stotra-ratnakar',
          title: 'स्तोत्र दर्शन • सर्वदेव स्तुति संग्रह',
          subtitle: 'सम्पूर्ण २३२+ प्रामाणिक स्तोत्र संग्रह',
          badge: '२३२+ स्तोत्र',
          icon: '🕉️',
          action: () => onSelectBookForReading('granth-brihat-stotra-ratnakar', 1),
        },
        ...CANONICAL_DEITIES.slice(0, 9).map(d => ({
          id: `deity-${d.id}`,
          title: d.name,
          subtitle: d.sanskritTitle,
          badge: `${getAllStotrasForDarshan(d.id, 'all').length} स्तोत्र`,
          icon: d.icon,
          action: () => {
            setActiveDarshan('stotra');
            setStotraDeity(d.id);
          },
        })),
      ],
      pujavidhi: [
        {
          id: 'granth-vishnu-pujan-paddhati',
          title: 'श्री लक्ष्मीनारायण देवपूजा एवं षोडशोपचार पद्धति',
          subtitle: 'सस्वर पुरुषसूक्त (१६ मन्त्र) • पञ्चामृत • शङ्ख स्नान • तुलसीदल',
          badge: '१९ पत्र',
          icon: '🪷',
          action: () => onSelectBookForReading('granth-vishnu-pujan-paddhati', 1),
        },
        {
          id: 'granth-ram-darbar-pujan-paddhati',
          title: 'श्री रामदरबार देवपूजा पद्धति',
          subtitle: 'सीता-लक्ष्मण-भरत-शत्रुघ्न-हनुमत् सहित • अङ्ग-आयुध पूजा • १०८ नामावली',
          badge: '१९ पत्र',
          icon: '🏹',
          action: () => onSelectBookForReading('granth-ram-darbar-pujan-paddhati', 1),
        },
        {
          id: 'granth-krishna-pujan-paddhati',
          title: 'श्रीराधाकृष्ण देवपूजा पद्धति',
          subtitle: 'युगल सरकार • गोपीचन्दन • अष्टसखी अर्चन • १०८ नामावली • आरती',
          badge: '१९ पत्र',
          icon: '🦚',
          action: () => onSelectBookForReading('granth-krishna-pujan-paddhati', 1),
        },
        {
          id: 'granth-hanumat-pujan-paddhati',
          title: 'श्रीहनुमत् देवपूजा पद्धति',
          subtitle: 'सिन्दूर-चमेली तैल लेपन • अष्टसिद्धि-नवनिधि • द्वादशनाम • १०८ नामावली',
          badge: '१९ पत्र',
          icon: '🚩',
          action: () => onSelectBookForReading('granth-hanumat-pujan-paddhati', 1),
        },
        {
          id: 'granth-satyanarayan-pujan-paddhati',
          title: 'श्री सत्यनारायण देवपूजा एवं व्रत-कथा पद्धति',
          subtitle: 'षोडशोपचार • सपाद भक्ष्य नैवेद्य • सम्पूर्ण ५ अध्याय व्रत-कथा • १०८ नामावली',
          badge: '१९ पत्र',
          icon: '✨',
          action: () => onSelectBookForReading('granth-satyanarayan-pujan-paddhati', 1),
        },
        {
          id: 'granth-lakshmi-pujan-paddhati',
          title: 'श्री महालक्ष्मी देवपूजा पद्धति (दीपावली विधान)',
          subtitle: 'सस्वर श्रीसूक्त • अष्टलक्ष्मी • कुबेर-पूजन • कनकधारा • १०८ नामावली',
          badge: '१९ पत्र',
          icon: '🪷',
          action: () => onSelectBookForReading('granth-lakshmi-pujan-paddhati', 1),
        },
        {
          id: 'granth-saraswati-pujan-paddhati',
          title: 'श्री सरस्वती देवपूजा पद्धति (वसन्त पञ्चमी)',
          subtitle: 'पुस्तक-वीणा-लेखनी प्रतिष्ठा • सरस्वती सूक्त • द्वादशनाम • १०८ नामावली',
          badge: '१९ पत्र',
          icon: '🪿',
          action: () => onSelectBookForReading('granth-saraswati-pujan-paddhati', 1),
        },
        {
          id: 'granth-chamunda-pujan-paddhati',
          title: 'श्री चामुण्डा देवी पूजा पद्धति (नवार्ण विधान)',
          subtitle: 'नवार्ण मन्त्र न्यास • दशाायुध • मातृका-भैरव अर्चन • १०८ नामावली',
          badge: '१९ पत्र',
          icon: '🗡️',
          action: () => onSelectBookForReading('granth-chamunda-pujan-paddhati', 1),
        },
        {
          id: 'granth-janmashtami-balkrishna-pujan',
          title: 'श्रीकृष्ण जन्माष्टमी एवं बालकृष्ण जन्मोत्सव पद्धति',
          subtitle: 'अर्द्धरात्रि चन्द्रार्घ्य • पञ्चामृत महाभिषेक • हिण्डोला (झूला) • माखन-भोग',
          badge: '१९ पत्र',
          icon: '🦚',
          action: () => onSelectBookForReading('granth-janmashtami-balkrishna-pujan', 1),
        },
        {
          id: 'granth-tulsi-vivah-shaligram-pujan',
          title: 'श्री तुलसी-विवाह एवं शालग्राम-तुलसी पूजा पद्धति',
          subtitle: 'देवउठनी एकादशी • वर-कन्या वरण • मङ्गलाष्टक • कन्यादान • सप्तपदी फेरे',
          badge: '१९ पत्र',
          icon: '🌿',
          action: () => onSelectBookForReading('granth-tulsi-vivah-shaligram-pujan', 1),
        },
        {
          id: 'granth-diwali-chopda-lakshmi-pujan',
          title: 'दीपावली महालक्ष्मी, कुबेर एवं कलम-चोपड़ा पूजन पद्धति',
          subtitle: 'बहीखाता प्रतिष्ठा • स्वस्तिक-शुभ-लाभ • लेखनी-दवात • तुला-तिजोरी-दीपमालिका',
          badge: '१९ पत्र',
          icon: '🪔',
          action: () => onSelectBookForReading('granth-diwali-chopda-lakshmi-pujan', 1),
        },
        {
          id: 'granth-shivarchan-parthiveshvara-paddhati',
          title: 'श्री शिवार्चन एवं पार्थिवेश्वर पूजन पद्धति',
          subtitle: 'सस्वर महाभिषेक • पञ्चवक्त्र • अष्टमूर्ति • चण्डेश्वर बलि',
          badge: '२५ पत्र',
          icon: '🔱',
          action: () => onSelectBookForReading('granth-shivarchan-parthiveshvara-paddhati', 1),
        },
        {
          id: 'granth-sarva-deva-pujan-margadarshan',
          title: 'सर्वदेव पूजन मार्गदर्शन एवं विधि-रहस्य',
          subtitle: 'षोडशोपचार फल-रहस्य • १७ विचारणीय नियम • द्रव्य विवेक',
          badge: '८ पत्र',
          icon: '🪔',
          action: () => onSelectBookForReading('granth-sarva-deva-pujan-margadarshan', 1),
        },
        {
          id: 'granth-devi-rajopachar-pujan-paddhati',
          title: 'श्री दुर्गा देवी राजोपचार पूजन पद्धति',
          subtitle: 'द्वादशोपचार राजसी सेवा • दशाायुध • सखी-भैरव पूजन',
          badge: '११ पत्र',
          icon: '🌺',
          action: () => onSelectBookForReading('granth-devi-rajopachar-pujan-paddhati', 1),
        },
        {
          id: 'granth-ganesh-pujan-paddhati',
          title: 'श्री महागणपति देवपूजा एवं षोडशोपचार पद्धति',
          subtitle: 'सस्वर अथर्वशीर्ष • २१ दूर्वाङ्कुर • मोदक-महाभोग • सङ्कटनाशन • १०८ नामावली',
          badge: '१९ पत्र',
          icon: '🐘',
          action: () => onSelectBookForReading('granth-ganesh-pujan-paddhati', 1),
        },
        {
          id: 'granth-surya-navagraha-pujan-paddhati',
          title: 'श्री नवग्रह मण्डल एवं सवितृ-सूर्य देवपूजा पद्धति',
          subtitle: 'सस्वर नवग्रह मन्त्र • आदित्यहृदय • नवग्रह स्तोत्र • त्रिवार अर्घ्य • १०८ नामावली',
          badge: '१९ पत्र',
          icon: '☀️',
          action: () => onSelectBookForReading('granth-surya-navagraha-pujan-paddhati', 1),
        },
        {
          id: 'granth-vastu-mandala',
          title: 'श्री वास्तु मण्डल देवता स्थापनम्',
          subtitle: 'पद-न्यास, दिशा-देवता एवं वास्तु प्रतिष्ठा',
          badge: '८ पत्र',
          icon: '🏛️',
          action: () => onSelectBookForReading('granth-vastu-mandala', 1),
        },
        {
          id: 'granth-vastu-shanti-grihapravesha',
          title: 'वास्तु शान्ति, गृहप्रवेश एवं नींव पूजन',
          subtitle: 'द्वार-वेध शान्ति, मङ्गल प्रवेश एवं कलश प्रतिष्ठा',
          badge: '२२ पत्र',
          icon: '🏡',
          action: () => onSelectBookForReading('granth-vastu-shanti-grihapravesha', 1),
        },
        {
          id: 'granth-grahashanti',
          title: 'ग्रहशान्ति पद्धति एवं नवग्रह मन्त्र',
          subtitle: 'नवग्रह मण्डल, अधिदेवता, प्रत्यधिदेवता एवं शान्ति',
          badge: '१६ पत्र',
          icon: '🪐',
          action: () => onSelectBookForReading('granth-grahashanti', 1),
        },
        {
          id: 'granth-sarva-deva-mantra-sangrah',
          title: 'सर्वदेव पूजा मन्त्र सङ्ग्रह',
          subtitle: 'अखण्ड मन्त्र संहिता, स्वस्तिवाचन, कलश व अङ्गपूजा',
          badge: '२० पत्र',
          icon: '📜',
          action: () => onSelectBookForReading('granth-sarva-deva-mantra-sangrah', 1),
        },
      ],
      tantra: [
        {
          id: 'granth-shrividyarnava-tantram',
          title: 'श्रीविद्यार्णवतन्त्रम् (Śrī Vidyārṇava Tantram)',
          subtitle: '३७ श्वास • कादि-हादि विद्या • षोढा न्यास • चक्रार्चन',
          badge: 'आगम ग्रन्थ',
          icon: '🌺',
          action: () => onSelectBookForReading('granth-shrividyarnava-tantram', 1),
        },
        {
          id: 'granth-durgasaptashati',
          title: 'श्रीदुर्गासप्तशती - सिद्ध कुञ्जिका स्तोत्रम्',
          subtitle: 'प्रचण्ड कुञ्जिका मन्त्र, कीलक व तान्त्रिक प्रयोग',
          badge: 'कुञ्जिका',
          icon: '🗡️',
          action: () => onSelectBookForReading('granth-durgasaptashati', 1),
        },
        {
          id: 'granth-chandika-stotram',
          title: 'श्रीचण्डिकास्तोत्रम् (तीव्रचण्डिका)',
          subtitle: 'मार्कण्डेय पुराणीय तीव्रचण्डिका १२ बीजमन्त्र श्लोक',
          badge: '१२ श्लोक',
          icon: '⚔️',
          action: () => onSelectBookForReading('granth-chandika-stotram', 1),
        },
        {
          id: 'granth-saundarya-lahari',
          title: 'सौन्दर्यलहरी (आनन्दलहरी व सौन्दर्यलहरी)',
          subtitle: 'आद्य शङ्कराचार्य विरचित १०० तान्त्रिक श्लोक',
          badge: '१०० श्लोक',
          icon: '🪷',
          action: () => onSelectBookForReading('granth-saundarya-lahari', 1),
        },
      ],
      'veda-purana': [
        {
          id: 'granth-bhagavad-gita',
          title: 'श्रीमद्भगवद्गीता',
          subtitle: 'सम्पूर्ण १८ अध्याय, ७०० श्लोक, अन्वय व हिन्दी अनुवाद',
          badge: '१८ अध्याय',
          icon: '📖',
          action: () => onSelectBookForReading('granth-bhagavad-gita', 1),
        },
        {
          id: 'granth-vishnu-sahasranama-gita-press',
          title: 'श्रीविष्णुसहस्रनामस्तोत्रम्',
          subtitle: 'महाभारत अनुशासनपर्व • १००० दिव्य नाम सरल अर्थ सहित',
          badge: '१००० नाम',
          icon: '📿',
          action: () => onSelectBookForReading('granth-vishnu-sahasranama-gita-press', 1),
        },
        {
          id: 'granth-rudri',
          title: 'श्रीरुद्राष्टाध्यायी (सस्वर रुद्राभिषेक मन्त्र)',
          subtitle: 'शुक्ल यजुर्वेद वाजसनेयी माध्यन्दिन संहिता',
          badge: 'सस्वर पाठ',
          icon: '🔱',
          action: () => onSelectBookForReading('granth-rudri', 1),
        },
        {
          id: 'granth-purushasuktam',
          title: 'पुरुषसूक्तम् (ऋग्वेद १०.९०)',
          subtitle: 'सस्वर १६ वैदिक ऋचाएं एवं षोडश कला पुरुष',
          badge: 'ऋग्वेद',
          icon: '☀️',
          action: () => onSelectBookForReading('granth-purushasuktam', 1),
        },
        {
          id: 'granth-shrisuktam',
          title: 'श्रीसूक्तम् (ऋग्वेदीय खिलभाग सस्वर)',
          subtitle: 'हिरण्यवर्णां हरिणीं... १६ सस्वर मन्त्र व फलश्रुति',
          badge: '१६ मन्त्र',
          icon: '🪷',
          action: () => onSelectBookForReading('granth-shrisuktam', 1),
        },
        {
          id: 'granth-arjuna-durga-stuti',
          title: 'श्रीअर्जुनकृत दुर्गास्तोत्रम्',
          subtitle: 'महाभारत भीष्मपर्व (अध्याय २३) विजय वरदान',
          badge: 'महाभारत',
          icon: '🏹',
          action: () => onSelectBookForReading('granth-arjuna-durga-stuti', 1),
        },
        {
          id: 'granth-gopikagitam',
          title: 'श्रीमद्गोपिकागीतम्',
          subtitle: 'श्रीमद्भागवत दशमस्कन्ध रासपञ्चाध्यायी',
          badge: 'भागवत',
          icon: '🐄',
          action: () => onSelectBookForReading('granth-gopikagitam', 1),
        },
        {
          id: 'granth-bhashaparichchheda',
          title: 'भाषापरिच्छेदः - कारिकावली',
          subtitle: 'न्याय-वैशेषिक दर्शन का मूलभूत मानक ग्रन्थ',
          badge: 'न्याय दर्शन',
          icon: '⚖️',
          action: () => onSelectBookForReading('granth-bhashaparichchheda', 1),
        },
        {
          id: 'granth-subhashita-vinodini',
          title: 'संस्कृत सुभाषित विनोदिनी',
          subtitle: 'नीति, धर्म, विद्या एवं वैराग्य सम्बन्धी सुभाषित',
          badge: 'सुभाषित',
          icon: '💎',
          action: () => onSelectBookForReading('granth-subhashita-vinodini', 1),
        },
      ],
    };
  }, [onSelectBookForReading]);

  // Dynamic counts for each stotra genre under the currently selected deity
  const genreCounts = useMemo(() => {
    const baseForDeity = getAllStotrasForDarshan(stotraDeity, 'all');
    const counts: Record<string, number> = { all: baseForDeity.length };
    for (const g of CANONICAL_STOTRA_GENRES) {
      if (g.id !== 'all') {
        counts[g.id] = baseForDeity.filter(
          (item) => (item.genre || classifyStotraGenre(item.title)) === g.id
        ).length;
      }
    }
    return counts;
  }, [stotraDeity, refreshKey]);

  // Stotras List derived for Stotra Darshan
  const stotrasList = useMemo(() => {
    const all = getAllStotrasForDarshan(stotraDeity, selectedGenre);
    if (!stotraSearch.trim()) return all;
    const q = stotraSearch.trim().toLowerCase();
    return all.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.author && s.author.toLowerCase().includes(q))
    );
  }, [stotraDeity, selectedGenre, stotraSearch, refreshKey]);

  const getDeityTheme = (title: string, desc: string): DeityTheme => {
    const combined = `${title} ${desc}`.toLowerCase();
    if (combined.includes('स्तोत्ररत्नाकर') || combined.includes('स्तोत्र संग्रह') || combined.includes('२२४ स्तोत्र')) {
      return {
        name: 'स्तोत्र दर्शन (सर्वदेव स्तुति)',
        gradient: 'from-amber-950/95 via-orange-950/70 to-neutral-900',
        border: 'border-amber-600/70 hover:border-amber-400',
        badge: 'bg-amber-950 text-amber-300 border-amber-800',
        glyph: '🕉️',
        mantra: '॥ स जयति सिन्दूरवदनो देवो यत्पादपङ्कजस्मरणम् ॥',
      };
    }
    if (combined.includes('पूजन मार्गदर्शन') || combined.includes('विधि-रहस्य') || combined.includes('मार्गदर्शन')) {
      return {
        name: 'पूजाविधि दर्शन (मार्गदर्शन व रहस्य)',
        gradient: 'from-amber-950/95 via-red-950/70 to-neutral-900',
        border: 'border-amber-600/70 hover:border-amber-400',
        badge: 'bg-amber-950 text-amber-300 border-amber-800',
        glyph: '🪔',
        mantra: '॥ ॐ अपवित्रः पवित्रो वा सर्वावस्थां गतोऽपि वा ॥',
      };
    }
    if (combined.includes('वास्तु') || combined.includes('गृहप्रवेश') || combined.includes('नींव')) {
      return {
        name: 'वास्तु पुरुष / गृह',
        gradient: 'from-amber-950/90 via-emerald-950/60 to-neutral-900',
        border: 'border-amber-700/60 hover:border-emerald-600',
        badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
        glyph: '🏛️',
        mantra: '॥ ॐ वास्तोष्पते प्रतिजानीह्यस्मान् ॥',
      };
    }
    if (combined.includes('गणेश') || combined.includes('गणपति') || combined.includes('atharva')) {
      return {
        name: 'श्रीगणेश',
        gradient: 'from-orange-950/90 via-amber-950/60 to-neutral-900',
        border: 'border-orange-800/60 hover:border-orange-600',
        badge: 'bg-orange-950 text-orange-400 border-orange-800',
        glyph: '🐘',
        mantra: '॥ ॐ गं गणपतये नमः ॥',
      };
    }
    if (combined.includes('रुद्र') || combined.includes('शिव') || combined.includes('ताण्डव') || combined.includes('शम्भु') || combined.includes('शङ्कर') || combined.includes('शंकर')) {
      return {
        name: 'महादेव शिव',
        gradient: 'from-sky-950/90 via-indigo-950/60 to-neutral-900',
        border: 'border-sky-800/60 hover:border-sky-500',
        badge: 'bg-sky-950 text-sky-300 border-sky-800',
        glyph: '🔱',
        mantra: '॥ ॐ नमः शिवाय ॥',
      };
    }
    if (combined.includes('सप्तशती') || combined.includes('चण्डीपाठ') || combined.includes('देवी माहात्म्यम्')) {
      return {
        name: 'भगवती जगदम्बा (दुर्गासप्तशती)',
        gradient: 'from-rose-950/95 via-red-950/75 to-neutral-900',
        border: 'border-rose-600/70 hover:border-amber-400',
        badge: 'bg-rose-950 text-rose-300 border-rose-800',
        glyph: '🔱',
        mantra: '॥ ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे ॥',
      };
    }
    if (combined.includes('लक्ष्मी') || combined.includes('दुर्गा') || combined.includes('चण्डी') || combined.includes('कुञ्जिका')) {
      return {
        name: 'भगवती दुर्गा / लक्ष्मी',
        gradient: 'from-rose-950/90 via-red-950/60 to-neutral-900',
        border: 'border-rose-800/60 hover:border-rose-500',
        badge: 'bg-rose-950 text-rose-300 border-rose-800',
        glyph: '🪷',
        mantra: '॥ ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः ॥',
      };
    }
    if (combined.includes('पुरुष') || combined.includes('गीता') || combined.includes('कृष्ण') || combined.includes('विष्णु') || combined.includes('नारायण') || combined.includes('गोपिका') || combined.includes('लहरी')) {
      return {
        name: 'श्रीकृष्ण / श्रीहरि',
        gradient: 'from-amber-950/90 via-yellow-950/60 to-neutral-900',
        border: 'border-amber-700/60 hover:border-amber-500',
        badge: 'bg-amber-950 text-amber-300 border-amber-800',
        glyph: '🦚',
        mantra: '॥ ॐ नमो भगवते वासुदेवाय ॥',
      };
    }
    if (combined.includes('भाषापरिच्छेद') || combined.includes('न्याय') || combined.includes('दर्शन') || combined.includes('कारिका')) {
      return {
        name: 'न्याय-दर्शन शास्त्र',
        gradient: 'from-cyan-950/90 via-slate-950/60 to-neutral-900',
        border: 'border-cyan-800/60 hover:border-cyan-500',
        badge: 'bg-cyan-950 text-cyan-300 border-cyan-800',
        glyph: '⚖️',
        mantra: '॥ प्रमाणैरर्थपरीक्षणं न्यायः ॥',
      };
    }
    if (combined.includes('सुभाषित') || combined.includes('नीति') || combined.includes('विनोदिनी')) {
      return {
        name: 'सुभाषित रत्नमाला',
        gradient: 'from-emerald-950/90 via-teal-950/60 to-neutral-900',
        border: 'border-emerald-800/60 hover:border-emerald-500',
        badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
        glyph: '💎',
        mantra: '॥ सुभाषितं हारि विशुद्धमुत्तमम् ॥',
      };
    }
    if (combined.includes('सूर्य') || combined.includes('आदित्य') || combined.includes('भास्कर')) {
      return {
        name: 'भगवान् सूर्यनारायण',
        gradient: 'from-yellow-950/90 via-orange-950/60 to-neutral-900',
        border: 'border-yellow-700/60 hover:border-yellow-500',
        badge: 'bg-yellow-950 text-yellow-300 border-yellow-800',
        glyph: '☀️',
        mantra: '॥ ॐ घृणिः सूर्याय नमः ॥',
      };
    }
    if (combined.includes('हनुमान') || combined.includes('चालीसा') || combined.includes('बजरंग')) {
      return {
        name: 'श्रीहनुमान जी',
        gradient: 'from-red-950/90 via-orange-950/60 to-neutral-900',
        border: 'border-red-700/60 hover:border-red-500',
        badge: 'bg-red-950 text-red-300 border-red-800',
        glyph: '🚩',
        mantra: '॥ ॐ हनुमते नमः ॥',
      };
    }
    if (combined.includes('विद्यार्णव') || combined.includes('श्रीविद्या') || combined.includes('तन्त्र') || combined.includes('तंत्र') || combined.includes('त्रिपुरसुन्दरी') || combined.includes('ललिता') || combined.includes('कादि') || combined.includes('हादि')) {
      return {
        name: 'श्रीविद्या / शाक्त तन्त्र',
        gradient: 'from-rose-950/95 via-fuchsia-950/70 to-neutral-900',
        border: 'border-fuchsia-700/60 hover:border-rose-400',
        badge: 'bg-fuchsia-950 text-rose-300 border-fuchsia-800',
        glyph: '🌺',
        mantra: '॥ ॐ ऐं ह्रीं श्रीं त्रिपुरसुन्दर्यै नमः ॥',
      };
    }
    if (combined.includes('ग्रह') || combined.includes('नवग्रह') || combined.includes('ग्रहशान्ति')) {
      return {
        name: 'नवग्रह मण्डल',
        gradient: 'from-purple-950/90 via-indigo-950/60 to-neutral-900',
        border: 'border-purple-800/60 hover:border-purple-500',
        badge: 'bg-purple-950 text-purple-300 border-purple-800',
        glyph: '🪐',
        mantra: '॥ ॐ नवग्रहेभ्यो नमः ॥',
      };
    }
    return {
      name: 'वैदिक शास्त्र',
      gradient: 'from-neutral-900 via-neutral-950 to-neutral-900',
      border: 'border-neutral-800 hover:border-neutral-700',
      badge: 'bg-neutral-800 text-neutral-300 border-neutral-700',
      glyph: '📖',
      mantra: '॥ ॐ तत्सत् ॥',
    };
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case 'sa':
        return { text: 'संस्कृतम्', color: 'bg-amber-950 text-amber-300 border-amber-800' };
      case 'hi':
        return { text: 'हिन्दी', color: 'bg-orange-950 text-orange-300 border-orange-800' };
      case 'mixed':
        return { text: 'संस्कृत-हिन्दी', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
      default:
        return { text: 'देवनागरी', color: 'bg-blue-950 text-blue-300 border-blue-800' };
    }
  };

  // Filtered Books for Non-Stotra Darshans or 'All'
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      // Exclude test fixture books
      const isTestBook =
        b.title.toLowerCase().includes('test') ||
        b.title.includes('परीक्षण') ||
        b.author === 'Author' ||
        b.description === 'Desc';
      if (isTestBook) return false;

      // Filter by active Darshan
      if (activeDarshan !== 'all') {
        const bookDarshan = getBookDarshan(b.id, b.title);
        if (bookDarshan !== activeDarshan) return false;
      }

      const matchSearch =
        searchTerm.trim() === '' ||
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchSearch;
    });
  }, [books, activeDarshan, searchTerm]);

  const sanitizeDescription = (desc: string): string => {
    if (!desc) return '';
    return desc
      .replace(/\(SanskritDocuments\.org[^)]*\)/gi, '')
      .replace(/SanskritDocuments\.org/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Canonical 4 Darshans Toolbar with Dropdown Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-neutral-800 relative z-30">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible no-scrollbar py-1 max-w-full -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {CANONICAL_DARSHANS.map((d) => {
            const isSelected = activeDarshan === d.id;
            const isDropdownOpen = openDropdown === d.id;

            return (
              <div key={d.id} className="relative darshan-dropdown-container flex-shrink-0">
                <div
                  className={`inline-flex items-stretch rounded-xl text-xs sm:text-sm font-devanagari transition-all whitespace-nowrap border shadow-sm ${
                    isSelected
                      ? 'bg-amber-600 text-neutral-950 font-bold border-amber-500 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400'
                      : 'bg-neutral-900 hover:bg-neutral-850 text-neutral-200 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {/* Darshan Main Selection Tab (Clicking when already active toggles dropdown) */}
                  <button
                    type="button"
                    onClick={() => {
                      if (activeDarshan === d.id) {
                        setOpenDropdown((prev) => (prev === d.id ? null : d.id));
                      } else {
                        setActiveDarshan(d.id);
                        setSearchTerm('');
                        setOpenDropdown(null);
                      }
                    }}
                    className="flex items-center gap-2 px-3.5 sm:px-4 py-2 cursor-pointer focus:outline-none"
                  >
                    <span className="text-base">{d.icon}</span>
                    <span>{d.name}</span>
                  </button>

                  {/* Dropdown Menu Trigger Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenDropdown((prev) => (prev === d.id ? null : d.id));
                    }}
                    title={`${d.name} सूची व विकल्प`}
                    aria-expanded={isDropdownOpen}
                    className={`px-2.5 sm:px-3 flex items-center justify-center border-l cursor-pointer transition-colors focus:outline-none ${
                      isSelected
                        ? 'border-amber-700/60 hover:bg-amber-700/50 text-neutral-950'
                        : 'border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-amber-300'
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180 text-amber-300' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Floating Dropdown Menu with Click-Outside Backdrop */}
                {isDropdownOpen && (
                  <>
                    {/* Fixed Transparent Backdrop to safely close on click outside */}
                    <div
                      className="fixed inset-0 z-40 bg-black/60 sm:bg-black/25 backdrop-blur-xs cursor-default"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenDropdown(null);
                      }}
                    />

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={`absolute top-full mt-2 w-72 sm:w-84 max-h-[75vh] overflow-y-auto bg-[#140C07] border border-amber-600/70 rounded-2xl shadow-2xl p-2 z-50 divide-y divide-neutral-900/80 animate-in fade-in zoom-in-95 duration-150 ${
                        d.id === 'veda-purana' ? 'right-0' : 'left-0'
                      }`}
                    >
                    {/* Stotra Darshan Dropdown */}
                    {d.id === 'stotra' && (
                      <div className="space-y-1">
                        <div className="px-3 py-1.5 text-[11px] font-semibold text-amber-300/80 font-devanagari flex items-center gap-1.5 border-b border-amber-950/80 pb-2 mb-1">
                          <span>🕉️</span>
                          <span>स्तोत्र दर्शन • पावन स्तुति संग्रह</span>
                        </div>
                        <button
                          onClick={() => {
                            setActiveDarshan('stotra');
                            setStotraDeity('all');
                            setSelectedGenre('all');
                            setStotraLayout('unified');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-amber-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">📖</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-amber-300 font-devanagari">
                              सम्पूर्ण स्तोत्र अनुक्रमणिका (सर्वदेव स्तुति संग्रह)
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              २३२+ स्तोत्र, १३ देव-मण्डल व विधा वर्गीकरण
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setActiveDarshan('stotra');
                            setStotraDeity('shiva');
                            setSelectedGenre('all');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-sky-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🔱</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-sky-300 font-devanagari">
                              देवाधिदेव शिव स्तोत्राणि
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              शिवमहिम्नः, रुद्राष्टक, ताण्डव, दारिद्र्यदहन आदि
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setActiveDarshan('stotra');
                            setStotraDeity('ganesha');
                            setSelectedGenre('all');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-orange-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🐘</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-orange-300 font-devanagari">
                              श्रीगणेश स्तोत्राणि
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              संकटनाशन, गणपत्यथर्वशीर्ष, पञ्चरत्न आदि
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setActiveDarshan('stotra');
                            setStotraDeity('vishnu');
                            setSelectedGenre('all');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-amber-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🦚</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-amber-300 font-devanagari">
                              भगवान् विष्णु एवं श्रीकृष्ण स्तोत्राणि
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              विष्णुसहस्रनाम, अच्चुताष्टक, मधुराष्टक आदि
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setActiveDarshan('stotra');
                            setStotraDeity('durga');
                            setSelectedGenre('all');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-rose-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🪷</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-rose-300 font-devanagari">
                              भगवती दुर्गा एवं शक्ति स्तोत्राणि
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              महिषासुरमर्दिनी, भवानी अष्टक, देव्यपराधक्षमापन
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setActiveDarshan('stotra');
                            setStotraDeity('rama');
                            setSelectedGenre('all');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-red-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🏹</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-red-300 font-devanagari">
                              श्रीराम एवं श्रीहनुमान स्तुति
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              रामरक्षा स्तोत्र, हनुमान चालीसा, बजरंग बाण
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setActiveDarshan('stotra');
                            setStotraDeity('all');
                            setSelectedGenre('kavacha');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-amber-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🛡️</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-amber-300 font-devanagari">
                              समस्त देव रक्षा कवच संग्रह
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              शिव, दुर्गा, राम, नारायण आदि के दिव्य कवच
                            </div>
                          </div>
                        </button>
                      </div>
                    )}

                    {/* Pujavidhi Darshan Dropdown */}
                    {d.id === 'pujavidhi' && (
                      <div className="space-y-1">
                        <div className="px-3 py-1.5 text-[11px] font-semibold text-amber-300/80 font-devanagari flex items-center gap-1.5 border-b border-amber-950/80 pb-2 mb-1">
                          <span>🪔</span>
                          <span>पूजाविधि दर्शन • कर्मकाण्ड ग्रन्थमाला</span>
                        </div>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-vishnu-pujan-paddhati');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-amber-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🪷</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-amber-300 font-devanagari">
                              श्री लक्ष्मीनारायण देवपूजा एवं षोडशोपचार पद्धति
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              १९ पावन पत्र • सस्वर पुरुषसूक्त (१६ मन्त्र), शङ्ख-स्नान, तुलसीदल
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-ram-darbar-pujan-paddhati');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-amber-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🏹</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-amber-300 font-devanagari">
                              श्री रामदरबार देवपूजा एवं षोडशोपचार पद्धति
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              १९ पावन पत्र • सीता-लक्ष्मण-भरत-शत्रुघ्न-हनुमत्, अङ्गपूजा, १०८ नामावली
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-krishna-pujan-paddhati');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-emerald-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🦚</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-emerald-300 font-devanagari">
                              श्रीराधाकृष्ण देवपूजा एवं षोडशोपचार पद्धति
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              १९ पावन पत्र • युगल सरकार, गोपीचन्दन, अष्टसखी अर्चन, १०८ नामावली
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-hanumat-pujan-paddhati');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-red-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🚩</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-red-300 font-devanagari">
                              श्रीहनुमत् देवपूजा एवं षोडशोपचार पद्धति
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              १९ पावन पत्र • सिन्दूर-चमेली तैल, अष्टसिद्धि-नवनिधि, १०८ नामावली
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-shivarchan-parthiveshvara-paddhati');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-sky-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🔱</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-sky-300 font-devanagari">
                              श्री शिवार्चन एवं पार्थिवेश्वर पूजन पद्धति
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              २५ पावन पत्र • पूर्वाङ्ग, कलश, महाभिषेक (१६ मन्त्र), नामावली
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-sarva-deva-pujan-margadarshan');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-amber-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🪔</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-amber-300 font-devanagari">
                              सर्वदेव पूजन मार्गदर्शन एवं विधि-रहस्य
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              ८ पत्र • १७ विचारणीय नियम, षोडशोपचार फल, पत्र-पुष्प विवेक
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-devi-rajopachar-pujan-paddhati');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-rose-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🌺</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-rose-300 font-devanagari">
                              श्री दुर्गा देवी राजोपचार पूजन पद्धति
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              ११ पावन पत्र • राजसी द्वादशोपचार, दशाायुध, भैरव-सखी पूजन
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-ganesh-pujan-paddhati');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-orange-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🐘</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-orange-300 font-devanagari">
                              श्री गणेश पूजन पद्धति
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              २४ पावन पत्र • कलश, षोडश मातृका, नवग्रह, गणपत्यथर्वशीर्ष
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setActiveDarshan('pujavidhi');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-amber-950/40 transition-colors flex items-start gap-2.5 group cursor-pointer border-t border-neutral-900 mt-1 pt-1.5"
                        >
                          <span className="text-base mt-0.5">📜</span>
                          <div>
                            <div className="text-xs font-semibold text-amber-300 group-hover:text-amber-200 font-devanagari">
                              समस्त पूजा एवं कर्मकाण्ड ग्रन्थमाला →
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              पूजाविधि दर्शन के समस्त ग्रन्थ ग्रिड देखें
                            </div>
                          </div>
                        </button>
                      </div>
                    )}

                    {/* Tantra Darshan Dropdown */}
                    {d.id === 'tantra' && (
                      <div className="space-y-1">
                        <div className="px-3 py-1.5 text-[11px] font-semibold text-rose-300/80 font-devanagari flex items-center gap-1.5 border-b border-rose-950/80 pb-2 mb-1">
                          <span>🔱</span>
                          <span>तन्त्र दर्शन • आगम एवं महाविद्या</span>
                        </div>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-durga-saptashati');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-rose-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🗡️</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-rose-300 font-devanagari">
                              श्रीदुर्गासप्तशती (सप्तशती चण्डी मन्त्र)
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              सम्पूर्ण २८ पावन अध्याय, पूर्वाङ्ग, उत्तरङ्ग व ऑडियो
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-saundarya-lahari');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-fuchsia-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🌸</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-fuchsia-300 font-devanagari">
                              सौन्दर्यलहरी (आनन्दलहरी १०० श्लोक)
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              आदि शङ्कराचार्य विरचित श्रीविद्या तन्त्र महाकाव्य
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-durga-saptashloki');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-rose-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🌺</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-rose-300 font-devanagari">
                              श्रीदुर्गासप्तश्लोकी
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              शिव-पार्वती सम्वाद, विनियोग, ध्यान व सात मूल मन्त्र
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-chandika-stotram');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-red-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">⚔️</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-red-300 font-devanagari">
                              श्रीचण्डिकास्तोत्रम् (तीव्रचण्डिका)
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              मार्कण्डेय पुराणीय १२ प्रचण्ड बीजमन्त्र श्लोक
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setActiveDarshan('tantra');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-rose-950/40 transition-colors flex items-start gap-2.5 group cursor-pointer border-t border-neutral-900 mt-1 pt-1.5"
                        >
                          <span className="text-base mt-0.5">📜</span>
                          <div>
                            <div className="text-xs font-semibold text-rose-300 group-hover:text-rose-200 font-devanagari">
                              समस्त तन्त्र एवं आगम ग्रन्थमाला →
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              तन्त्र दर्शन के समस्त ग्रन्थ ग्रिड देखें
                            </div>
                          </div>
                        </button>
                      </div>
                    )}

                    {/* Veda-Purana Darshan Dropdown */}
                    {d.id === 'veda-purana' && (
                      <div className="space-y-1">
                        <div className="px-3 py-1.5 text-[11px] font-semibold text-amber-300/80 font-devanagari flex items-center gap-1.5 border-b border-amber-950/80 pb-2 mb-1">
                          <span>📜</span>
                          <span>वेद-पुराण दर्शन • श्रुति व इतिहास</span>
                        </div>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-bhagavad-gita');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-amber-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🦚</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-amber-300 font-devanagari">
                              श्रीमद्भगवद्गीता (सम्पूर्ण १८ अध्याय)
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              ७०० श्लोक एवं श्रीगीताजी की आरती (अनुवाद सहित)
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-vishnu-sahasranama-gita-press');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-amber-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">📿</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-amber-300 font-devanagari">
                              श्रीविष्णुसहस्रनामस्तोत्रम्
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              महाभारत अनुशासन पर्व (१००० दिव्य नाम व अर्थ)
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-sri-suktam');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-amber-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🪷</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-amber-300 font-devanagari">
                              श्रीसूक्तम् (ऋग्वेदीय खिलभाग सस्वर)
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              सस्वर १६ मन्त्र एवं महाफलश्रुति (ऑडियो सहित)
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-kanakadhara-stotram');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-yellow-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🪙</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-yellow-300 font-devanagari">
                              श्रीकनकधारास्तोत्रम्
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              आदि शङ्कराचार्य विरचित २१ वसन्ततिलका श्लोक
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            onSelectBookForReading('granth-arjuna-durga-stuti');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-indigo-950/60 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          <span className="text-base mt-0.5">🏹</span>
                          <div>
                            <div className="text-xs font-bold text-amber-100 group-hover:text-indigo-300 font-devanagari">
                              श्रीअर्जुनकृत दुर्गास्तोत्रम्
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              महाभारत भीष्मपर्व (२३) — श्रीकृष्ण-निर्देशित स्तुति
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setActiveDarshan('veda-purana');
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-amber-950/40 transition-colors flex items-start gap-2.5 group cursor-pointer border-t border-neutral-900 mt-1 pt-1.5"
                        >
                          <span className="text-base mt-0.5">📜</span>
                          <div>
                            <div className="text-xs font-semibold text-amber-300 group-hover:text-amber-200 font-devanagari">
                              समस्त वेद-पुराण ग्रन्थमाला →
                            </div>
                            <div className="text-[10px] text-neutral-400 font-devanagari">
                              वेद-पुराण दर्शन के समस्त ग्रन्थ ग्रिड देखें
                            </div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
              </div>
            );
          })}
        </div>
      </div>

      {/* जीवन्त पूजा पद्धति एवं कर्मकाण्ड ग्रन्थमाला (केवल पूजाविधि दर्शन में) */}
      {(activeDarshan === 'pujavidhi' || activeDarshan === 'all') && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E1106] via-[#160B03] to-[#0D0702] border border-amber-700/60 p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 text-xs font-devanagari">
                <span>🪔</span>
                <span>पूजाविधि दर्शन • प्रामाणिक कर्मकाण्ड, सोपानबद्ध अनुष्ठान एवं मन्त्र संहिता</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-amber-100 font-serifDevanagari">
                जीवन्त पूजा पद्धति एवं कर्मकाण्ड ग्रन्थमाला
              </h2>
              <p className="text-xs text-amber-200/70 font-devanagari">
                सस्वर वैदिक मन्त्र, अक्षत-पुष्प-द्रव्य-मुद्रा निर्देश, षोडशोपचार, महाभिषेक एवं देव-परिवार पूजन।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {/* 1. Sri Lakshmi Narayana Deva Puja Paddhati */}
            <div
              onClick={() => onSelectBookForReading('granth-vishnu-pujan-paddhati')}
              className="group p-4 rounded-2xl bg-gradient-to-b from-amber-950/70 via-yellow-950/40 to-neutral-950 border border-amber-800/40 hover:border-amber-500/80 transition-all shadow-lg hover:shadow-amber-950/50 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">🪷</span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                    <FileText className="w-2.5 h-2.5" />
                    <span>१९ पावन पत्र</span>
                  </span>
                </div>
                <h3 className="font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 transition-colors">
                  श्री लक्ष्मीनारायण देवपूजा पद्धति
                </h3>
                <p className="text-[11px] text-neutral-300 font-devanagari line-clamp-2">
                  सस्वर पुरुषसूक्त (१६ मन्त्र), पञ्चामृत महाभिषेक, शङ्ख-स्नान, तुलसीदल-अर्चन व १०८ नामावली।
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-amber-900/40 flex items-center justify-between text-xs text-amber-300 font-devanagari font-medium group-hover:text-amber-200">
                <span>पठन व पूजन</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 2. Sri Ram Darbar Deva Puja Paddhati */}
            <div
              onClick={() => onSelectBookForReading('granth-ram-darbar-pujan-paddhati')}
              className="group p-4 rounded-2xl bg-gradient-to-b from-orange-950/70 via-amber-950/40 to-neutral-950 border border-orange-800/40 hover:border-orange-500/80 transition-all shadow-lg hover:shadow-orange-950/50 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">🏹</span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-orange-950 text-orange-300 border border-orange-800">
                    <FileText className="w-2.5 h-2.5" />
                    <span>१९ पावन पत्र</span>
                  </span>
                </div>
                <h3 className="font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 transition-colors">
                  श्री रामदरबार देवपूजा पद्धति
                </h3>
                <p className="text-[11px] text-neutral-300 font-devanagari line-clamp-2">
                  सीता-लक्ष्मण-भरत-शत्रुघ्न-हनुमत् परिवार, अङ्ग-आयुध पूजा, १०८ नामावली एवं श्रीरामस्तुति।
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-orange-900/40 flex items-center justify-between text-xs text-orange-300 font-devanagari font-medium group-hover:text-amber-200">
                <span>पठन व पूजन</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 3. Sri Radha Krishna Deva Puja Paddhati */}
            <div
              onClick={() => onSelectBookForReading('granth-krishna-pujan-paddhati')}
              className="group p-4 rounded-2xl bg-gradient-to-b from-emerald-950/70 via-teal-950/40 to-neutral-950 border border-emerald-800/40 hover:border-emerald-500/80 transition-all shadow-lg hover:shadow-emerald-950/50 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">🦚</span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    <FileText className="w-2.5 h-2.5" />
                    <span>१९ पावन पत्र</span>
                  </span>
                </div>
                <h3 className="font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 transition-colors">
                  श्रीराधाकृष्ण देवपूजा पद्धति
                </h3>
                <p className="text-[11px] text-neutral-300 font-devanagari line-clamp-2">
                  युगल सरकार, गोपीचन्दन, मञ्जरी-तुलसी, अष्टसखी अर्चन, श्रीकृष्ण १०८ नामावली व आरती कुञ्जबिहारी की।
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-emerald-900/40 flex items-center justify-between text-xs text-emerald-300 font-devanagari font-medium group-hover:text-amber-200">
                <span>पठन व पूजन</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 4. Sri Hanumat Deva Puja Paddhati */}
            <div
              onClick={() => onSelectBookForReading('granth-hanumat-pujan-paddhati')}
              className="group p-4 rounded-2xl bg-gradient-to-b from-red-950/70 via-rose-950/40 to-neutral-950 border border-red-800/40 hover:border-red-500/80 transition-all shadow-lg hover:shadow-red-950/50 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">🚩</span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
                    <FileText className="w-2.5 h-2.5" />
                    <span>१९ पावन पत्र</span>
                  </span>
                </div>
                <h3 className="font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 transition-colors">
                  श्रीहनुमत् देवपूजा पद्धति
                </h3>
                <p className="text-[11px] text-neutral-300 font-devanagari line-clamp-2">
                  सिन्दूर-चमेली तैल लेपन, अङ्गपूजा, अष्टसिद्धि-नवनिधि, द्वादशनाम, १०८ नामावली व आरती कीजै हनुमान लला की।
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-red-900/40 flex items-center justify-between text-xs text-red-300 font-devanagari font-medium group-hover:text-amber-200">
                <span>पठन व पूजन</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 2. Sri Shivarchan & Parthiveshvara Pujan Paddhati */}
            <div
              onClick={() => onSelectBookForReading('granth-shivarchan-parthiveshvara-paddhati')}
              className="group p-4 rounded-2xl bg-gradient-to-b from-sky-950/70 via-indigo-950/40 to-neutral-950 border border-sky-800/40 hover:border-sky-500/80 transition-all shadow-lg hover:shadow-sky-950/50 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">🔱</span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800">
                    <FileText className="w-2.5 h-2.5" />
                    <span>२५ पावन पत्र</span>
                  </span>
                </div>
                <h3 className="font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 transition-colors">
                  श्री शिवार्चन एवं पार्थिवेश्वर पूजन पद्धति
                </h3>
                <p className="text-[11px] text-neutral-300 font-devanagari line-clamp-2">
                  पूर्वाङ्ग, कलश, सस्वर महाभिषेक धारा (१६ मन्त्र), पञ्चवक्त्र, अष्टमूर्ति, १०८ नामावली व चण्डेश्वर बलि।
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-sky-900/40 flex items-center justify-between text-xs text-sky-300 font-devanagari font-medium group-hover:text-amber-200">
                <span>पठन व पूजन</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 2. Sarva Deva Pujan Margadarshan & Vidhi Rahasya */}
            <div
              onClick={() => onSelectBookForReading('granth-sarva-deva-pujan-margadarshan')}
              className="group p-4 rounded-2xl bg-gradient-to-b from-amber-950/70 via-orange-950/40 to-neutral-950 border border-amber-800/40 hover:border-amber-500/80 transition-all shadow-lg hover:shadow-amber-950/50 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">🪔</span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                    <FileText className="w-2.5 h-2.5" />
                    <span>८ मार्गदर्शक पत्र</span>
                  </span>
                </div>
                <h3 className="font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 transition-colors">
                  सर्वदेव पूजन मार्गदर्शन एवं विधि-रहस्य
                </h3>
                <p className="text-[11px] text-neutral-300 font-devanagari line-clamp-2">
                  षोडशोपचार/राजोपचार फल-रहस्य, १७ विचारणीय नियम, सर्वदेव पत्र-पुष्प विवेक व पञ्चविध रुद्रपाठ विधान।
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-amber-900/40 flex items-center justify-between text-xs text-amber-300 font-devanagari font-medium group-hover:text-amber-200">
                <span>पठन व स्वाध्याय</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 3. Sri Durga Devi Rajopachar Pujan Paddhati */}
            <div
              onClick={() => onSelectBookForReading('granth-devi-rajopachar-pujan-paddhati')}
              className="group p-4 rounded-2xl bg-gradient-to-b from-rose-950/70 via-red-950/40 to-neutral-950 border border-rose-800/40 hover:border-rose-500/80 transition-all shadow-lg hover:shadow-rose-950/50 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">🌺</span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                    <FileText className="w-2.5 h-2.5" />
                    <span>११ पावन पत्र</span>
                  </span>
                </div>
                <h3 className="font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 transition-colors">
                  श्री दुर्गा देवी राजोपचार पूजन पद्धति
                </h3>
                <p className="text-[11px] text-neutral-300 font-devanagari line-clamp-2">
                  राजसी द्वादशोपचार सेवाएँ (छत्र, चामर, दर्पण आदि), दशाायुध, भैरव-सखी-सिंह पूजन व १०८ कुङ्कुम नामावली।
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-rose-900/40 flex items-center justify-between text-xs text-rose-300 font-devanagari font-medium group-hover:text-amber-200">
                <span>पठन व पूजन</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 4. Sri Ganesh Pujan Paddhati */}
            <div
              onClick={() => onSelectBookForReading('granth-ganesh-pujan-paddhati')}
              className="group p-4 rounded-2xl bg-gradient-to-b from-orange-950/70 via-amber-950/40 to-neutral-950 border border-orange-800/40 hover:border-orange-500/80 transition-all shadow-lg hover:shadow-orange-950/50 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">🐘</span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-orange-950 text-orange-300 border border-orange-800">
                    <FileText className="w-2.5 h-2.5" />
                    <span>२४ पावन पत्र</span>
                  </span>
                </div>
                <h3 className="font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 transition-colors">
                  श्री गणेश पूजन पद्धति
                </h3>
                <p className="text-[11px] text-neutral-300 font-devanagari line-clamp-2">
                  गणेश मन्त्र-गायत्री, कलश, षोडश मातृका, नवग्रह, आरती, संकटनाशन एवं गणपत्यथर्वशीर्षम्।
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-orange-900/40 flex items-center justify-between text-xs text-orange-300 font-devanagari font-medium group-hover:text-amber-200">
                <span>पठन व पूजन</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* शारदीय नवरात्रि एवं महादेवी पावन पारायण (केवल तन्त्र दर्शन में) */}
      {(activeDarshan === 'tantra' || activeDarshan === 'all') && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#240606] via-[#160706] to-[#0D0404] border border-rose-900/60 p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-rose-950/80 border border-rose-700/50 text-rose-300 text-xs font-devanagari">
              <span>🌺</span>
              <span>शारदीय नवरात्रि एवं महालक्ष्मी आराधना • प्रामाणिक पारायण व शास्त्रीय ऑडियो</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-amber-100 font-serifDevanagari">
              महादेवी पावन स्तवन एवं सस्वर पारायण
            </h2>
            <p className="text-xs text-rose-200/70 font-devanagari">
              सस्वर एवं शास्त्रसम्मत शुद्ध पाठ — प्रत्येक अध्याय व श्लोक के साथ प्रामाणिक ऑडियो प्रवाह।
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* 1. Sri Durga Saptashati */}
          <div
            onClick={() => onSelectBookForReading('granth-durga-saptashati')}
            className="group p-4 rounded-2xl bg-gradient-to-b from-rose-950/70 via-red-950/40 to-neutral-950 border border-rose-800/40 hover:border-rose-500/80 transition-all shadow-lg hover:shadow-rose-950/50 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">🗡️</span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                  <Volume2 className="w-2.5 h-2.5" />
                  <span>२८ ऑडियो</span>
                </span>
              </div>
              <h3 className="font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 transition-colors">
                श्रीदुर्गासप्तशती
              </h3>
              <p className="text-[11px] text-neutral-300 font-devanagari line-clamp-2">
                सम्पूर्ण २८ पावन अध्याय, पूर्वाङ्ग, उत्तरङ्ग, सिद्धकुञ्जिका व क्षमापन।
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-rose-900/40 flex items-center justify-between text-xs text-rose-300 font-devanagari font-medium group-hover:text-amber-200">
              <span>पठन व श्रवण</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Sri Suktam */}
          <div
            onClick={() => onSelectBookForReading('granth-sri-suktam')}
            className="group p-4 rounded-2xl bg-gradient-to-b from-amber-950/70 via-orange-950/40 to-neutral-950 border border-amber-800/40 hover:border-amber-500/80 transition-all shadow-lg hover:shadow-amber-950/50 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">🪷</span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                  <Volume2 className="w-2.5 h-2.5" />
                  <span>११:४४ सस्वर</span>
                </span>
              </div>
              <h3 className="font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 transition-colors">
                श्रीसूक्तम्
              </h3>
              <p className="text-[11px] text-neutral-300 font-devanagari line-clamp-2">
                ऋग्वेदीय खिलभाग सस्वर १६ मन्त्र एवं महाफलश्रुति (हिरण्यवर्णां हरिणीं...)।
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-amber-900/40 flex items-center justify-between text-xs text-amber-300 font-devanagari font-medium group-hover:text-amber-200">
              <span>पठन व श्रवण</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Kanakadhara Stotram */}
          <div
            onClick={() => onSelectBookForReading('granth-kanakadhara-stotram')}
            className="group p-4 rounded-2xl bg-gradient-to-b from-yellow-950/70 via-amber-950/40 to-neutral-950 border border-yellow-800/40 hover:border-yellow-500/80 transition-all shadow-lg hover:shadow-yellow-950/50 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">🪙</span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-yellow-950 text-yellow-300 border border-yellow-800">
                  <Volume2 className="w-2.5 h-2.5" />
                  <span>०९:२७ ऑडियो</span>
                </span>
              </div>
              <h3 className="font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 transition-colors">
                श्रीकनकधारास्तोत्रम्
              </h3>
              <p className="text-[11px] text-neutral-300 font-devanagari line-clamp-2">
                आदि शङ्कराचार्य विरचित स्वर्णवृष्टिप्रदायक २१ वसन्ततिलका श्लोक।
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-yellow-900/40 flex items-center justify-between text-xs text-yellow-300 font-devanagari font-medium group-hover:text-amber-200">
              <span>पठन व श्रवण</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Saundaryalahari */}
          <div
            onClick={() => onSelectBookForReading('granth-saundarya-lahari')}
            className="group p-4 rounded-2xl bg-gradient-to-b from-fuchsia-950/70 via-rose-950/40 to-neutral-950 border border-fuchsia-800/40 hover:border-fuchsia-500/80 transition-all shadow-lg hover:shadow-fuchsia-950/50 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">🌸</span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800">
                  <Volume2 className="w-2.5 h-2.5" />
                  <span>६७:३० ऑडियो</span>
                </span>
              </div>
              <h3 className="font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 transition-colors">
                सौन्दर्यलहरी
              </h3>
              <p className="text-[11px] text-neutral-300 font-devanagari line-clamp-2">
                आनन्दलहरी (१-४१) एवं सौन्दर्यलहरी (४२-१००) सम्पूर्ण १०० शिखरिणी श्लोक।
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-fuchsia-900/40 flex items-center justify-between text-xs text-fuchsia-300 font-devanagari font-medium group-hover:text-amber-200">
              <span>पठन व श्रवण</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. Sri Durga Saptashloki */}
          <div
            onClick={() => onSelectBookForReading('granth-durga-saptashloki')}
            className="group p-4 rounded-2xl bg-gradient-to-b from-rose-950/70 via-red-950/40 to-neutral-950 border border-rose-800/40 hover:border-rose-500/80 transition-all shadow-lg hover:shadow-rose-950/50 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">🌺</span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                  <Volume2 className="w-2.5 h-2.5" />
                  <span>०२:४४ ऑडियो</span>
                </span>
              </div>
              <h3 className="font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 transition-colors">
                श्रीदुर्गासप्तश्लोकी
              </h3>
              <p className="text-[11px] text-neutral-300 font-devanagari line-clamp-2">
                शिव-पार्वती सम्वाद, विनियोग, ध्यान एवं भगवती दुर्गा के सात कल्याणकारी मूल मन्त्र।
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-rose-900/40 flex items-center justify-between text-xs text-rose-300 font-devanagari font-medium group-hover:text-amber-200">
              <span>पठन व श्रवण</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 6. Sri Chandika Stotram (Complete 12 Verses) */}
          <div
            onClick={() => onSelectBookForReading('granth-chandika-stotram')}
            className="group p-4 rounded-2xl bg-gradient-to-b from-red-950/70 via-orange-950/40 to-neutral-950 border border-red-800/40 hover:border-red-500/80 transition-all shadow-lg hover:shadow-red-950/50 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">⚔️</span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
                  <FileText className="w-2.5 h-2.5" />
                  <span>सम्पूर्ण १२ श्लोक</span>
                </span>
              </div>
              <h3 className="font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 transition-colors">
                श्रीचण्डिकास्तोत्रम्
              </h3>
              <p className="text-[11px] text-neutral-300 font-devanagari line-clamp-2">
                मार्कण्डेय पुराणीय तीव्रचण्डिका स्तोत्र — ध्यान, १२ प्रचण्ड बीजमन्त्र श्लोक व मन्त्रसिद्धि।
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-red-900/40 flex items-center justify-between text-xs text-red-300 font-devanagari font-medium group-hover:text-amber-200">
              <span>पठन व स्वाध्याय</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 7. Sri Arjuna Krita Durga Stuti */}
          <div
            onClick={() => onSelectBookForReading('granth-arjuna-durga-stuti')}
            className="group p-4 rounded-2xl bg-gradient-to-b from-indigo-950/70 via-rose-950/40 to-neutral-950 border border-indigo-800/40 hover:border-indigo-500/80 transition-all shadow-lg hover:shadow-indigo-950/50 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">🏹</span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                  <Volume2 className="w-2.5 h-2.5" />
                  <span>०१:५६ ऑडियो</span>
                </span>
              </div>
              <h3 className="font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 transition-colors">
                श्रीअर्जुनकृत दुर्गास्तोत्रम्
              </h3>
              <p className="text-[11px] text-neutral-300 font-devanagari line-clamp-2">
                महाभारत भीष्मपर्व (२३) — श्रीकृष्ण-निर्देशित स्तुति व भगवती का साक्षात् विजय-वरदान।
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-indigo-900/40 flex items-center justify-between text-xs text-indigo-300 font-devanagari font-medium group-hover:text-amber-200">
              <span>पठन व श्रवण</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
      )}

      {/* 2. STOTRA DARSHAN VIEW (Pure Deity First - Absolutely Zero Publisher Branding) */}
      {activeDarshan === 'stotra' && (
        <div className="space-y-6">
          {stotraLayout === 'unified' ? (
            <SingleUnifiedIndex
              stotraLayout={stotraLayout}
              onLayoutChange={setStotraLayout}
              onSelectStotra={(item) => {
                if (item.isCustom && onSelectCustomStotra) {
                  onSelectCustomStotra(item);
                } else {
                  onSelectBookForReading(
                    'granth-brihat-stotra-ratnakar',
                    item.pdfPage || 1,
                    item.id
                  );
                }
              }}
            />
          ) : (
            <>
              {/* Sacred Stotra Darshan Header */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C0A04] via-[#120602] to-[#0D0401] border border-amber-600/30 p-6 sm:p-8 shadow-2xl text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs font-devanagari">
              <span>🕉️</span>
              <span>विशुद्ध देवतोपासना एवं पावन स्तुति पीठ</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-100 font-serifDevanagari tracking-wide drop-shadow-md">
              स्तोत्र दर्शन
            </h1>
            <p className="text-xs sm:text-sm text-sacred-400/90 font-serifDevanagari tracking-wider italic">
              ॥ यस्य स्मरणमात्रेण जन्मसंसारबन्धनात् । विमुच्यते नमस्तस्मै विष्णवे प्रभविष्णवे ॥
            </p>
            <p className="text-xs text-amber-200/70 font-devanagari max-w-xl mx-auto">
              समस्त आराध्य देवी-देवताओं के प्रामाणिक स्तोत्र, कवच, सहस्रनाम एवं अष्टक — किसी प्रकाशक के बिना, विशुद्ध देव-आराधना हेतु।
            </p>
          </div>

          {/* Deity Selector Filter Pills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-devanagari px-1">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                <span>🔱</span>
                <span>देवता चुनें:</span>
              </span>
              <span className="font-mono text-amber-300/80">{stotrasList.length} स्तोत्र उपलब्ध</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-800">
              <button
                onClick={() => setStotraDeity('all')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-devanagari whitespace-nowrap transition-all border cursor-pointer ${
                  stotraDeity === 'all'
                    ? 'bg-amber-600 text-neutral-950 font-bold border-amber-500 shadow-md'
                    : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <DeitySvgIcon deityId="all" size={17} />
                <span>समस्त देवता</span>
              </button>
              {CANONICAL_DEITIES.map((deity) => (
                <button
                  key={deity.id}
                  onClick={() => setStotraDeity(deity.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-devanagari whitespace-nowrap transition-all border cursor-pointer ${
                    stotraDeity === deity.id
                      ? `${deity.badge} font-bold ring-2 ring-amber-500/50 shadow-md`
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <DeitySvgIcon deityId={deity.id} size={17} />
                  <span>{deity.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Liturgical Genre Filter Pills (कवच, अष्टकम्, पञ्चकम्, मानसपूजा, शतनाम/सहस्रनाम, हृदयम्, स्तोत्र) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-devanagari px-1">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                <span>🪷</span>
                <span>स्तोत्र विधा / प्रकार:</span>
              </span>
              <span className="text-[11px] text-neutral-400">
                {selectedGenre === 'all'
                  ? 'समस्त विधाएँ प्रदर्शित'
                  : CANONICAL_STOTRA_GENRES.find((g) => g.id === selectedGenre)?.name}
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-neutral-800">
              {CANONICAL_STOTRA_GENRES.map((genre) => {
                const count = genreCounts[genre.id] || 0;
                const isSelected = selectedGenre === genre.id;
                return (
                  <button
                    key={genre.id}
                    onClick={() => setSelectedGenre(genre.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-devanagari whitespace-nowrap transition-all border cursor-pointer ${
                      isSelected
                        ? `${genre.badge} font-bold ring-2 ring-amber-500/60 shadow-md scale-[1.02]`
                        : count === 0
                        ? 'bg-neutral-900/40 text-neutral-500 border-neutral-800/60 opacity-60'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-neutral-100'
                    }`}
                  >
                    <span>{genre.icon}</span>
                    <span>{genre.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected
                          ? 'bg-amber-400/20 text-amber-200'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stotra Search & Layout Toggle Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={stotraSearch}
                onChange={(e) => setStotraSearch(e.target.value)}
                placeholder="स्तोत्र का नाम खोजें (उदा. 'रुद्राष्टकम्', 'शिवमहिम्नः', 'कनकधारा', 'विष्णुसहस्रनाम')..."
                className="w-full pl-10 pr-10 py-3 bg-neutral-950 text-neutral-100 placeholder-neutral-500 border border-neutral-800 rounded-2xl text-xs sm:text-sm font-devanagari focus:outline-none focus:border-amber-500 shadow-inner"
              />
              {stotraSearch && (
                <button
                  onClick={() => setStotraSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => setStotraLayout('unified')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-devanagari transition-all cursor-pointer ${
                  (stotraLayout as string) === 'unified'
                    ? 'bg-amber-600 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="एकल अनुक्रमणिका (Single Accordion Index)"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">एकल सूची</span>
              </button>
              <button
                onClick={() => setStotraLayout('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-devanagari transition-all cursor-pointer ${
                  stotraLayout === 'grid'
                    ? 'bg-amber-600 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="ग्रिड दृश्य (Grid View)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ग्रिड</span>
              </button>
              <button
                onClick={() => setStotraLayout('compact')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-devanagari transition-all cursor-pointer ${
                  stotraLayout === 'compact'
                    ? 'bg-amber-600 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="सघन सूची (Compact List View)"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">सघन कार्ड</span>
              </button>
            </div>
          </div>

              {/* Stotras Content for Grid/Compact View */}
              {stotrasList.length === 0 ? (
            <div className="bg-neutral-900/40 border border-dashed border-neutral-800 rounded-3xl p-12 text-center space-y-3">
              <span className="text-3xl">🪔</span>
              <p className="text-sm text-neutral-300 font-devanagari">
                कोई स्तोत्र नहीं मिला।
              </p>
            </div>
          ) : stotraLayout === 'grid' ? (
            /* 1. Grid View: Sacred Pothi Tiles */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stotrasList.map((item) => {
                const deity = getDeityById(item.deityId);
                const genreInfo = CANONICAL_STOTRA_GENRES.find(
                  (g) => g.id === (item.genre || classifyStotraGenre(item.title))
                );
                const handleRead = () => {
                  if (item.isCustom && onSelectCustomStotra) {
                    onSelectCustomStotra(item);
                  } else {
                    onSelectBookForReading(
                      'granth-brihat-stotra-ratnakar',
                      item.pdfPage || 1,
                      item.id
                    );
                  }
                };

                return (
                  <div
                    key={String(item.id)}
                    onClick={handleRead}
                    className="p-5 rounded-2xl bg-gradient-to-b from-[#18120B] via-[#120D07] to-[#0A0704] border border-amber-900/40 hover:border-amber-500/80 hover:bg-[#1A130C] transition-all duration-200 flex flex-col justify-between group shadow-lg hover:shadow-2xl hover:shadow-amber-950/40 hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                  >
                    {/* Corner Sacred Gradient */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-600/10 to-transparent pointer-events-none rounded-bl-3xl" />

                    <div>
                      {/* Top Meta: Deity, Genre & Folio */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 font-medium flex items-center gap-1.5 font-devanagari shadow-xs">
                            <DeitySvgIcon deityId={item.deityId} size={15} />
                            <span>{deity?.name || 'स्तोत्र'}</span>
                          </span>
                          {genreInfo && genreInfo.id !== 'all' && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-devanagari flex items-center gap-1 ${genreInfo.badge}`}>
                              <span>{genreInfo.icon}</span>
                              <span>{genreInfo.name}</span>
                            </span>
                          )}
                        </div>
                        {String(item.id).startsWith('supp-') ? (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/70 font-devanagari font-semibold">
                            📜 प्रामाणिक पाठ
                          </span>
                        ) : item.isCustom ? (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-devanagari font-semibold">
                            ✨ स्वनिर्मित
                          </span>
                        ) : (
                          <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1 shrink-0">
                            <BookOpen className="w-3 h-3 text-amber-500/70" />
                            <span>पत्र {item.pdfPage || item.bookPage || 1}</span>
                          </span>
                        )}
                      </div>

                      {/* Stotra Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-amber-50 font-serifDevanagari group-hover:text-amber-300 transition-colors leading-snug tracking-wide">
                        {item.title}
                      </h3>

                      {item.author && (
                        <p className="text-xs text-neutral-400 mt-1.5 font-devanagari flex items-center gap-1">
                          <span className="text-neutral-500">रचयिता:</span>
                          <span className="text-amber-200/80">{item.author}</span>
                        </p>
                      )}
                    </div>

                    {/* Bottom Action Indicator */}
                    <div className="mt-5 pt-3 border-t border-amber-950/80 flex items-center justify-between">
                      <span className="text-xs text-amber-600/70 font-serifDevanagari">
                        ॥ शास्त्रोक्त पाठ ॥
                      </span>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 group-hover:bg-amber-600 border border-amber-800/50 group-hover:border-amber-400 text-amber-300 group-hover:text-neutral-950 text-xs font-semibold font-devanagari transition-all shadow-sm">
                        <Eye className="w-3.5 h-3.5" />
                        <span>पठन करें</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* 2. Compact List View: Swift Parayana Anukramanika */
            <div className="bg-neutral-950/80 border border-amber-900/30 rounded-2xl divide-y divide-neutral-900 overflow-hidden shadow-xl">
              {stotrasList.map((item, idx) => {
                const deity = getDeityById(item.deityId);
                const genreInfo = CANONICAL_STOTRA_GENRES.find(
                  (g) => g.id === (item.genre || classifyStotraGenre(item.title))
                );
                const handleRead = () => {
                  if (item.isCustom && onSelectCustomStotra) {
                    onSelectCustomStotra(item);
                  } else {
                    onSelectBookForReading(
                      'granth-brihat-stotra-ratnakar',
                      item.pdfPage || 1,
                      item.id
                    );
                  }
                };

                return (
                  <div
                    key={String(item.id)}
                    onClick={handleRead}
                    className="p-3 sm:px-5 hover:bg-neutral-900/90 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-neutral-500 w-7 text-right shrink-0">
                        #{idx + 1}
                      </span>
                      <DeitySvgIcon deityId={item.deityId} size={19} className="shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-amber-100 font-serifDevanagari group-hover:text-amber-300 truncate">
                            {item.title}
                          </h4>
                          {genreInfo && genreInfo.id !== 'all' && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-md border font-devanagari shrink-0 hidden sm:inline-flex items-center gap-1 ${genreInfo.badge}`}>
                              <span>{genreInfo.icon}</span>
                              <span>{genreInfo.sanskritName}</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-400 font-devanagari">
                          {deity?.name || 'स्तोत्र'}
                          {item.author ? ` • ${item.author}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-neutral-400">
                        {String(item.id).startsWith('supp-') ? '📜 प्रामाणिक' : `पत्र ${item.pdfPage || item.bookPage || 1}`}
                      </span>
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-neutral-900 group-hover:bg-amber-600 border border-neutral-800 group-hover:border-amber-400 text-neutral-300 group-hover:text-neutral-950 text-xs font-devanagari font-medium transition-all">
                        <span>पढ़ें</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  )}

      {/* 3. NON-STOTRA DARSHANS & ALL BOOKS GRID */}
      {activeDarshan !== 'stotra' && (
        <div className="space-y-6">
          {/* Darshan Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1208] via-[#100C06] to-[#0A0804] border border-amber-700/30 p-6 sm:p-8 shadow-2xl text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-100 font-serifDevanagari">
              {activeDarshan === 'pujavidhi' && 'पूजाविधि दर्शन'}
              {activeDarshan === 'tantra' && 'तन्त्र दर्शन'}
              {activeDarshan === 'veda-purana' && 'वेद-पुराण दर्शन'}
              {activeDarshan === 'all' && 'सम्पूर्ण शास्त्र ग्रन्थालय'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-devanagari max-w-xl mx-auto">
              {activeDarshan === 'pujavidhi' && 'नित्यकर्म, सन्ध्यावन्दन, पंचोपचार, षोडशोपचार पूजा एवं अभिषेक विधान।'}
              {activeDarshan === 'tantra' && 'आगम, महाविद्या, श्रीविद्या, यन्त्र-उपासना एवं मन्त्र-न्यास शास्त्र।'}
              {activeDarshan === 'veda-purana' && 'श्रुति, उपनिषदः, श्रीमद्भगवद्गीता, महाभारत एवं पुराण।'}
              {activeDarshan === 'all' && 'ग्रन्थालय के समस्त पावन ग्रन्थ एवं पाण्डुलिपियाँ।'}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ग्रन्थ, ऋषि या मन्त्र खोजें..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 text-neutral-100 placeholder-neutral-500 border border-neutral-800 rounded-xl text-xs sm:text-sm font-devanagari focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Books Grid */}
          {filteredBooks.length === 0 ? (
            <div className="bg-neutral-900/40 border border-dashed border-neutral-800 rounded-3xl p-12 text-center space-y-3">
              <span className="text-3xl">📖</span>
              <p className="text-sm text-neutral-300 font-devanagari">
                इस वर्ग में कोई ग्रन्थ नहीं मिला।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredBooks.map((book) => {
                const deity = getDeityTheme(book.title, book.description);
                const lang = getLanguageLabel(book.language);

                // Clean display title without publisher or book names
                const displayTitle = book.id === 'granth-brihat-stotra-ratnakar'
                  ? 'स्तोत्र दर्शन • सर्वदेव स्तुति संग्रह'
                  : book.title.replace(/\s*\([^)]*गीताप्रेस[^)]*\)/gi, '').trim();

                return (
                  <div
                    key={book.id}
                    className={`bg-gradient-to-b ${deity.gradient} border ${deity.border} rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden`}
                  >
                    <div>
                      {/* Top Bar: Deity Badge & Language */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold flex items-center space-x-1 ${deity.badge}`}>
                          <span>{deity.glyph}</span>
                          <span>{deity.name}</span>
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${lang.color}`}>
                          {lang.text}
                        </span>
                      </div>

                      {/* Grantha Title */}
                      <h3 className="text-lg font-bold text-neutral-100 font-serifDevanagari line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors">
                        {displayTitle}
                      </h3>

                      {/* Author / Rishi */}
                      <p className="text-xs text-neutral-400 mt-1 font-devanagari flex items-center space-x-1">
                        <span className="text-neutral-500">दृष्टा / रचयिता:</span>
                        <span className="text-neutral-300 font-medium">{book.author || 'पारंपरिक महर्षि'}</span>
                      </p>

                      {/* Description */}
                      {book.description && (
                        <p className="text-xs text-neutral-400/90 mt-2.5 font-devanagari line-clamp-3 leading-relaxed bg-neutral-950/40 p-2.5 rounded-xl border border-neutral-800/60">
                          {sanitizeDescription(book.description)}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 font-devanagari px-1">
                        <span className="flex items-center space-x-1.5 font-mono text-amber-300/80">
                          <BookOpen className="w-3 h-3 text-amber-400" />
                          <span>{book.page_count} पत्र</span>
                        </span>
                        <span className="text-amber-400/80 font-medium">
                          ✓ प्रामाणिक पाठ
                        </span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectBookForReading(book.id)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sacred-600 to-amber-600 hover:from-sacred-500 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-sacred-950 transition-all font-devanagari active:scale-95 cursor-pointer"
                        title="पावन ग्रन्थ पठन प्रारम्भ करें"
                      >
                        <Eye className="w-4 h-4" />
                        <span>पठन मोड (Read)</span>
                      </button>

                      {/* Export Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setExportDropdown(exportDropdown === book.id ? null : book.id)}
                          className="p-2.5 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 bg-neutral-900 border border-neutral-700/80 transition-all cursor-pointer"
                          title="ग्रन्थ निर्यात (Export)"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {exportDropdown === book.id && (
                          <div className="absolute right-0 bottom-full mb-2 w-52 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl py-2 z-30 font-devanagari animate-in fade-in zoom-in-95">
                            <div className="px-3 py-1 text-[11px] font-semibold text-amber-400 border-b border-neutral-800">
                              निर्यात प्रारूप चुनें:
                            </div>
                            <button
                              onClick={() => {
                                onExport(book.id, 'txt');
                                setExportDropdown(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800 flex items-center space-x-2 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-amber-400" />
                              <span>Plain Text (Unicode UTF-8)</span>
                            </button>
                            <button
                              onClick={() => {
                                onExport(book.id, 'docx');
                                setExportDropdown(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800 flex items-center space-x-2 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-400" />
                              <span>Word Document (.DOCX)</span>
                            </button>
                            <button
                              onClick={() => {
                                onExport(book.id, 'pdf');
                                setExportDropdown(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800 flex items-center space-x-2 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-red-400" />
                              <span>Preservation PDF (सस्वर)</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
