import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Search, User, Heart, ShoppingCart, Menu, Star, Play, Truck, BookOpen, Users, Leaf, X, ChevronLeft, ChevronRight, Quote, Trash2, ShoppingBag, Lock, Gift, Plus } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { categories as mockCategories, bestSellers as mockBestSellers, cakeGallery as mockCakeGallery, giftKits as mockGiftKits, socialPosts as mockSocialPosts, testimonials } from "../data/mockData";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [flippedKits, setFlippedKits] = useState<Set<number>>(new Set());
  const [flippedCakes, setFlippedCakes] = useState<Set<number>>(new Set());
  const [categories, setCategories] = useState<any[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [bestSellers, setBestSellers] = useState<any[]>(mockBestSellers);
  const [cakeGallery, setCakeGallery] = useState<any[]>(mockCakeGallery);
  const [giftKits, setGiftKits] = useState<any[]>(mockGiftKits);
  const [socialPosts, setSocialPosts] = useState<any[]>(mockSocialPosts);
  const [products, setProducts] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<any>({
    hero: { title: "O Docinho", subtitle: "A Magia em Cada Mordida", button_text: "Conhecer Delícias" },
    about: { title: "Nossa História", text: "Cada doce conta uma história de amor e dedicação..." },
    footer: { address: "Rua dos Doces, 123", phone: "(11) 99999-9999", instagram: "@odocinho" },
    settings: { whatsapp: "5511999999999" }
  });

  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [testimonialsList, setTestimonialsList] = useState<any[]>(testimonials);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const { toast } = useToast();

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({
      title: "Adicionado ao carrinho!",
      description: `${product.name} foi guardado na sua sacola.`,
    });
  };

  const updateQuantity = (id: any, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const finalizeOrder = () => {
    if (cart.length === 0) return;
    
    let message = "✨ *Novo Pedido - O Docinho* ✨\n\n";
    message += "Gostaria de encomendar os seguintes itens:\n\n";
    
    cart.forEach(item => {
      message += `▪️ *${item.quantity}x* ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    if (isGift) {
      message += "\n\n🎁 *Este pedido é para PRESENTE!*";
      if (giftMessage) {
        message += `\n📝 *Dedicatória:* ${giftMessage}`;
      }
    }

    message += "\n\nPode me informar a disponibilidade e o valor da entrega?";

    const phone = siteContent.footer?.phone?.replace(/\D/g, '') || "5511999999999";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const openWhatsApp = (message: string) => {
    const phone = siteContent.settings?.whatsapp || "5511999999999";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const [dynamicSections, setDynamicSections] = useState<any[]>([]);


  useEffect(() => {
    async function loadData() {
      const [catRes, dynSecRes, prodRes, galRes, instRes, contentRes] = await Promise.all([
        supabase.from("categories").select("*").order("id"),
        supabase.from("categorias_doces").select("*").order("created_at"),
        supabase.from("products").select("*").order("id"),
        supabase.from("gallery_items").select("*").order("id"),
        supabase.from("instagram_posts").select("*").order("id"),
        supabase.from("site_content").select("*")
      ]);
      
      if (contentRes.data) {
        const contentMap: any = {};
        contentRes.data.forEach(item => { contentMap[item.id] = item.content; });
        setSiteContent(prev => ({ ...prev, ...contentMap }));
        
        if (contentMap.dynamic_sections) {
          setDynamicSections(contentMap.dynamic_sections);
        }
        if (contentMap.testimonials && contentMap.testimonials.length > 0) {
          setTestimonialsList(contentMap.testimonials);
        }
      }

      if (prodRes.data) {
        const sections = contentRes.data?.find(i => i.id === 'dynamic_sections')?.content || [];
        const enrichedProducts = prodRes.data.map(p => {
          const section = sections.find((s: any) => s.id === p.category_id || s.slug === p.category);
          return { ...p, category: section?.name || p.category || "Variados" };
        });
        
        setProducts(enrichedProducts);
        const bs = enrichedProducts.filter(p => !p.is_gift_kit).map(p => ({
          id: p.id, name: p.name, rating: p.rating, price: p.price, originalPrice: p.original_price, image: p.image_url, category_id: p.category_id
        }));
        setBestSellers(bs);

        const gk = enrichedProducts.filter(p => p.is_gift_kit).map(p => ({
          id: p.id, name: p.name, description: p.description, price: p.price, image: p.image_url
        }));
        setGiftKits(gk);
      }
      
      if (galRes.data) {
        setCakeGallery(galRes.data.map(g => ({ id: g.id, name: g.name, image: g.image_url, description: g.description, price: 0 })));
      }
      
      if (instRes.data) {
        setSocialPosts(instRes.data.map(i => ({ id: i.id, image: i.image_url, hasVideo: i.has_video, videoUrl: i.video_url, post_url: i.post_url })));
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (testimonialsList.length === 0) return;
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonialsList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonialsList.length]);

  const prevTestimonial = () => setActiveTestimonial(prev => (prev - 1 + testimonialsList.length) % testimonialsList.length);
  const nextTestimonial = () => setActiveTestimonial(prev => (prev + 1) % testimonialsList.length);

  const toggleFlip = useCallback((id: number) => {
    setFlippedKits(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleFlipCake = useCallback((id: number) => {
    setFlippedCakes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white">
      {/* HEADER */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-foreground hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <a href="#home" className="flex items-center">
              <img src="/logo-odocinho.png" alt="O Docinho" className="h-14 md:h-16 w-auto object-contain" />
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => setIsFullMenuOpen(true)} className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide">Cardápio</button>
            <a href="#galeria-de-bolos" className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide">Galeria de Bolos</a>
            <a href="#contato" className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide">Contato</a>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
              <button onClick={() => setIsFullMenuOpen(true)} className="p-2.5 text-gray-700 hover:text-primary transition-colors">
                <Search size={22} />
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 text-gray-700 hover:text-primary transition-colors relative"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-muted px-4 py-6 shadow-lg"
          >
            <nav className="flex flex-col gap-4">
              {['Home', 'Cardápio', 'Galeria de Bolos', 'Contato'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(/ /g, '-').replace('á', 'a')}`} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </header>


            {/* KITS SECTION */}
      <section id="home" className="relative h-[100dvh] flex items-center justify-center pt-20 overflow-hidden bg-gradient-to-b from-primary/10 to-background">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-xl text-center md:text-left"
          >
            <motion.h1 variants={fadeInUp} className="font-serif text-5xl md:text-7xl font-bold leading-tight text-foreground mb-6">
              {siteContent.hero?.title || "A Verdadeira Experiência do Doce Caseiro"} <br/>
              <span className="text-primary italic text-3xl md:text-4xl block mt-2">O que o teu coração deseja?</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-lg md:text-xl mb-10 font-light">
              {siteContent.hero?.subtitle || "Cada mordida é uma viagem. Nossas receitas combinam a sofisticação da confeitaria francesa com o calor e a paixão da tradição brasileira."}
            </motion.p>
            <motion.div variants={fadeInUp} className="flex gap-4 justify-center md:justify-start">
              <button 
                className="bg-secondary text-secondary-foreground font-semibold px-10 py-4 rounded-full hover:bg-secondary/90 hover:scale-105 active:scale-95 transition-all shadow-md"
                onClick={() => setIsFullMenuOpen(true)}
              >
                Ver o Cardápio
              </button>
            </motion.div>
          </motion.div>

          <div className="relative hidden md:block h-[500px]">
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-3/4 h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-pink-50"
            >
              {siteContent.hero?.media1 ? (
                <img 
                  src={siteContent.hero.media1} 
                  alt="Hero 1" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-pink-100/40 animate-pulse flex items-center justify-center text-primary/30">
                  <span className="font-serif italic text-sm">Carregando...</span>
                </div>
              )}
            </motion.div>
            <motion.div 
              animate={{ y: [0, 15, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-0 left-0 w-1/2 h-[300px] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-pink-50"
            >
              {siteContent.hero?.media2 ? (
                <img 
                  src={siteContent.hero.media2} 
                  alt="Hero 2" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-pink-100/40 animate-pulse" />
              )}
            </motion.div>
          </div>
        </div>

        {/* SVG Wave Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[60px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,116.8,188.7,100.5,236.4,86.62,279.7,71.21,321.39,56.44Z" className="fill-background"></path>
          </svg>
        </div>
      </section>

      {/* NEW DYNAMIC SECTIONS */}
      {dynamicSections.map((section, index) => (
        <section 
          key={section.id} 
          id={section.slug} 
          className="py-24 overflow-hidden border-b border-white/10"
          style={{ 
            backgroundColor: section.bg_color || "#1a0805",
            color: section.text_color || "#ffffff"
          }}
        >
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-4xl md:text-6xl font-bold mb-6" 
                style={{ color: section.text_color || "inherit" }}
              >
                {section.name}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-lg md:text-xl leading-relaxed opacity-80"
              >
                {section.description}
              </motion.p>
              <div className="w-24 h-1 bg-secondary mx-auto mt-8"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products
                .filter(p => p.category === section.name || p.category_id === section.id)
                .map((product, pIdx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: pIdx * 0.1 }}
                    className="bg-white/5 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-secondary/50 transition-all group flex flex-col h-full shadow-2xl"
                  >
                    <div className="relative aspect-square overflow-hidden bg-white/10 p-2">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover rounded-[2rem] group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h4 className="font-serif text-xl font-bold mb-2 truncate">{product.name}</h4>
                      <p className="text-sm opacity-70 line-clamp-3 mb-6 leading-relaxed flex-1">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                        <span className="text-secondary font-bold text-xl">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </span>
                        <button 
                          onClick={() => addToCart(product)}
                          className="w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg hover:shadow-secondary/20"
                        >
                          <Plus size={24} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      ))}

      {/* QUICK NAVIGATION SECTION (ARCOS) */}
      <section id="categorias" className="py-24 bg-[#1a0805] relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <p className="text-secondary uppercase tracking-[0.3em] text-xs font-semibold mb-4">Descubra</p>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4">
              Explore Nossas Delícias
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto"></div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-10"
          >
            {(dynamicSections.length > 0 ? dynamicSections : categories).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col items-center gap-6 group cursor-pointer"
                onClick={() => {
                  const targetId = item.slug || `cat-${item.id}`;
                  const el = document.getElementById(targetId);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setIsFullMenuOpen(true);
                }}
              >
                <div className="relative w-40 md:w-56 aspect-[4/5] rounded-t-full overflow-hidden border-4 border-white/20 group-hover:border-secondary/50 transition-all duration-500 shadow-2xl transform group-hover:scale-105">
                  <img
                    src={item.card_image_url || item.image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-white group-hover:text-secondary transition-colors tracking-wide">
                  {item.name}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full pointer-events-none z-10" style={{ transform: "translateY(98%)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" width="100%" height="120" preserveAspectRatio="none" style={{ display: "block" }}>
            <path d="M0,0 L1440,0 L1440,30 Q1385,95 1330,30 Q1275,55 1220,30 Q1150,115 1080,30 Q1025,65 970,30 Q900,100 830,30 Q775,52 720,30 Q655,110 590,30 Q530,70 470,30 Q400,108 330,30 Q275,58 220,30 Q150,115 80,30 Q40,85 0,30 Z" fill="#3D1508" />
          </svg>
        </div>
      </section>

      {/* CAKE GALLERY */}
      <section id="galeria-de-bolos" className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <p className="text-secondary uppercase tracking-[0.3em] text-xs font-semibold mb-4">Confeitaria Artesanal</p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Galeria de Bolos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Obras de arte comestíveis.</p>
            <div className="w-24 h-[2px] bg-secondary mx-auto mt-6"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cakeGallery.map((cake, index) => {
              const isFlipped = flippedCakes.has(cake.id);
              return (
                <motion.div
                  key={cake.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                  style={{ perspective: "1200px" }}
                >
                  <div
                    onClick={() => toggleFlipCake(cake.id)}
                    className="relative cursor-pointer"
                    style={{
                      transformStyle: "preserve-3d",
                      transition: "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      height: "360px",
                    }}
                    onMouseEnter={() => setFlippedCakes(prev => new Set(prev).add(cake.id))}
                    onMouseLeave={() => setFlippedCakes(prev => { const n = new Set(prev); n.delete(cake.id); return n; })}
                  >
                    <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                      <img src={cake.image} alt={cake.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,8,5,0.88) 0%, rgba(26,8,5,0.15) 55%, transparent 100%)" }} />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-serif text-xl font-bold text-white">{cake.name}</h3>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-2xl flex flex-col justify-between p-7" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(145deg, #3D1508 0%, #2C1006 100%)", border: "1px solid rgba(201,168,76,0.4)" }}>
                      <p className="text-white/60 text-sm">{cake.description}</p>
                      <button onClick={() => addToCart(cake)} className="w-full py-3 rounded-xl font-bold text-sm bg-secondary text-[#1A0805]">Adicionar à Sacola</button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* TRUST BADGES */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-primary/5 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-primary/10">
              {[
                { icon: Truck, title: siteContent.badges?.t1_title || "Entrega Rápida", subtitle: siteContent.badges?.t1_sub || "Em toda a região", img: siteContent.badges?.t1_img },
                { icon: BookOpen, title: siteContent.badges?.t2_title || "Receitas Únicas", subtitle: siteContent.badges?.t2_sub || "Segredos de família", img: siteContent.badges?.t2_img },
                { icon: Users, title: siteContent.badges?.t3_title || "Clientes Felizes", subtitle: siteContent.badges?.t3_sub || "Milhares de sorrisos", img: siteContent.badges?.t3_img },
                { icon: Leaf, title: siteContent.badges?.t4_title || "100% Natural", subtitle: siteContent.badges?.t4_sub || "Ingredientes selecionados", img: siteContent.badges?.t4_img }
              ].map((badge, index) => (
                <div key={index} className={`flex flex-col items-center text-center ${index !== 0 ? 'pt-8 sm:pt-0' : ''}`}>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-primary overflow-hidden">
                    {badge.img ? (
                      <img src={badge.img} alt={badge.title} className="w-full h-full object-contain p-1" />
                    ) : (
                      <badge.icon size={28} />
                    )}
                  </div>
                  <h4 className="font-bold text-foreground mb-1">{badge.title}</h4>
                  <p className="text-sm text-muted-foreground">{badge.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION (RESTORED) */}
      <section id="sobre" className="py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl bg-pink-50/20">
                {siteContent.about?.image_url ? (
                  <img
                    src={siteContent.about.image_url}
                    alt="A nossa cozinha"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-pink-100/40 animate-pulse flex items-center justify-center text-primary/30">
                    <span className="font-serif italic text-sm">Carregando...</span>
                  </div>
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(44,16,6,0.4) 0%, transparent 60%)" }}></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4 border border-muted">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Star size={24} className="fill-secondary text-secondary" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-foreground leading-none mb-0.5">{siteContent.about?.badge_title || "5 Estrelas"}</p>
                  <p className="text-muted-foreground text-xs">{siteContent.about?.badge_subtitle || "No Google Reviews"}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="flex flex-col gap-6"
            >
              <div>
                <p className="text-secondary uppercase tracking-[0.3em] text-xs font-semibold mb-4">{siteContent.about?.label || "Nossa História"}</p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
                  {siteContent.about?.title_part1 || "Tradição e Amor"}<br />
                  <span className="text-primary italic">{siteContent.about?.title_part2 || "em cada detalhe"}</span>
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-base">
                {siteContent.about?.text1 || "Nascemos de uma paixão genuína pelos sabores da infância e pela arte da confeitaria francesa."}
              </p>
              <div className="grid grid-cols-3 gap-4 py-8 border-y border-border">
                {[
                  { value: siteContent.about?.stat1_val || "15+", label: siteContent.about?.stat1_label || "Anos de receitas" },
                  { value: siteContent.about?.stat2_val || "8K+", label: siteContent.about?.stat2_label || "Pedidos entregues" },
                  { value: siteContent.about?.stat3_val || "500+", label: siteContent.about?.stat3_label || "Receitas únicas" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-serif text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-muted-foreground text-[10px] mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button onClick={() => setIsFullMenuOpen(true)} className="bg-primary px-8 py-6 rounded-full text-white">Ver o Cardápio</Button>
                <Button onClick={() => openWhatsApp("Olá!")} variant="outline" className="px-8 py-6 rounded-full">Fale Conosco</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SOCIAL FEED (RESTORED) */}
      <section id="social" className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 25%, #fce4ec 50%, #fff0f5 75%, #fce4ec 100%)" }}>
        {/* Floating Instagram icons background */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <FaInstagram className="absolute text-primary/10" style={{ fontSize: 180, top: "8%", left: "2%" }} />
          <FaInstagram className="absolute text-primary/8" style={{ fontSize: 260, top: "-5%", right: "8%" }} />
          <FaInstagram className="absolute text-primary/10" style={{ fontSize: 120, top: "55%", left: "15%" }} />
          <FaInstagram className="absolute text-primary/6" style={{ fontSize: 340, bottom: "-10%", right: "-2%" }} />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-12">
            <a 
              href={`https://instagram.com/${(siteContent.footer?.instagram || "docinho.odocinho").replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm mb-4 hover:scale-105 hover:bg-white transition-all cursor-pointer"
            >
              <FaInstagram className="text-primary" size={18} />
              <span className="text-primary font-semibold text-sm">{siteContent.footer?.instagram || "@docinho.odocinho"}</span>
            </a>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Siga o nosso Instagram</h2>
          </div>
          <div className="flex overflow-x-auto pb-8 gap-4 snap-x no-scrollbar">
            {socialPosts.map((post) => (
              <div key={post.id} className="min-w-[250px] aspect-square relative group rounded-xl overflow-hidden cursor-pointer shadow-md">
                <img src={post.image} alt="Social post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaInstagram className="text-white text-3xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (RESTORED) */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <p className="text-secondary uppercase tracking-[0.3em] text-xs font-semibold mb-4">Depoimentos</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-16">O que dizem os nossos clientes</h2>
          <div className="max-w-4xl mx-auto relative">
            {testimonialsList.length > 0 && (
              <>
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-pink-50/20 p-10 md:p-16 rounded-[3rem] border border-pink-100"
                >
                  <Quote className="mx-auto mb-8 text-primary/20" size={60} />
                  <blockquote className="font-serif text-xl md:text-3xl italic mb-8">
                    "{testimonialsList[activeTestimonial]?.text}"
                  </blockquote>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-bold text-xl">{testimonialsList[activeTestimonial]?.name}</p>
                    </div>
                  </div>
                </motion.div>
                <div className="flex justify-center gap-4 mt-10">
                  <button onClick={prevTestimonial} className="p-3 rounded-full bg-white border border-border shadow-sm hover:bg-primary hover:text-white transition-all"><ChevronLeft /></button>
                  <button onClick={nextTestimonial} className="p-3 rounded-full bg-white border border-border shadow-sm hover:bg-primary hover:text-white transition-all"><ChevronRight /></button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER (RESTORED DETAILED) */}
      <footer id="contato" className="bg-[#1A0805] text-white pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <img src="/logo-odocinho.png" alt="O Docinho" className="h-20 w-auto mb-6 filter brightness-0 invert" />
              <p className="text-gray-400 text-sm leading-relaxed">
                Transformando açúcar, farinha e muito amor em momentos inesquecíveis.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Explore</h4>
              <ul className="flex flex-col gap-3 text-gray-400 text-sm">
                <li><a href="#sobre" className="hover:text-secondary transition-colors">Nossa História</a></li>
                <li><button onClick={() => setIsFullMenuOpen(true)} className="hover:text-secondary transition-colors">Cardápio</button></li>
                <li><a href="#galeria-de-bolos" className="hover:text-secondary transition-colors">Galeria de Bolos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Contato</h4>
              <p className="text-gray-400 text-sm mb-2">{siteContent.footer?.address}</p>
              {siteContent.footer?.phone && (
                <a 
                  href={`tel:${siteContent.footer.phone.replace(/\D/g, "")}`} 
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-secondary transition-colors text-sm mt-1 group"
                >
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-secondary group-hover:text-[#1A0805] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </span>
                  <span>
                    {(() => {
                      const clean = siteContent.footer.phone.replace(/\D/g, "");
                      if (clean.length === 13 && clean.startsWith("55")) {
                        return `+55 (${clean.substring(2, 4)}) ${clean.substring(4, 9)}-${clean.substring(9)}`;
                      } else if (clean.length === 11) {
                        return `(${clean.substring(0, 2)}) ${clean.substring(2, 7)}-${clean.substring(7)}`;
                      }
                      return siteContent.footer.phone;
                    })()}
                  </span>
                </a>
              )}
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Siga-nos</h4>
              <div className="flex gap-4">
                <a 
                  href={`https://instagram.com/${(siteContent.footer?.instagram || "docinho.odocinho").replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors"
                  title="Instagram"
                >
                  <FaInstagram size={18} />
                </a>
                <a 
                  href={`https://wa.me/${(siteContent.settings?.whatsapp || siteContent.footer?.phone?.replace(/\D/g, '') || "5511999999999")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors"
                  title="WhatsApp"
                >
                  <FaWhatsapp size={18} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-500 text-sm">&copy; 2026 O Docinho. Todos os direitos reservados. <a href="/admin" className="ml-4 opacity-30 hover:opacity-100 transition-opacity">Admin</a></p>
          </div>
        </div>
      </footer>

      {/* CART DRAWER (MODERNIZED) */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[110] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-white/90 backdrop-blur-2xl shadow-2xl flex flex-col border-l border-white/20"
            >
              <header className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-playfair font-bold text-gray-800">Sua Sacola</h2>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{cartCount} {cartCount === 1 ? 'item selecionado' : 'itens selecionados'}</p>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)} 
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center">
                      <ShoppingBag size={40} className="text-primary/20" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Sua sacola está vazia</p>
                      <p className="text-sm text-gray-400">Adicione algumas delícias para continuar.</p>
                    </div>
                    <Button onClick={() => setIsCartOpen(false)} variant="outline" className="mt-4 rounded-full px-8">Ver Cardápio</Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-5 group">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                          <img src={item.image_url || item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-gray-800 text-sm leading-tight">{item.name}</h4>
                              <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-gray-300 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <p className="text-primary font-bold text-sm mt-1">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center bg-gray-50 rounded-full border border-gray-100 p-1">
                              <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-full hover:bg-white hover:shadow-sm flex items-center justify-center transition-all text-gray-500">-</button>
                              <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-full hover:bg-white hover:shadow-sm flex items-center justify-center transition-all text-gray-500">+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {cart.length > 0 && (
                  <div className="pt-8 border-t border-gray-100 space-y-6">
                    <div className="p-5 bg-pink-50/50 rounded-2xl border border-primary/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary">
                            <Gift size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-800">É para presente?</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Adicione uma dedicatória</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={isGift}
                            onChange={(e) => setIsGift(e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      {isGift && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="overflow-hidden"
                        >
                          <textarea 
                            placeholder="Escreva sua mensagem aqui... (De: / Para:)"
                            value={giftMessage}
                            onChange={(e) => setGiftMessage(e.target.value)}
                            className="w-full bg-white border border-primary/10 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-300"
                            rows={3}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-gray-100 bg-white/50 space-y-6">
                  <div className="flex justify-between items-end">
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Total do Pedido</p>
                    <p className="text-3xl font-serif font-bold text-gray-800">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal)}
                    </p>
                  </div>
                  <button 
                    onClick={finalizeOrder} 
                    className="w-full py-5 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <ShoppingBag size={20} /> Finalizar no WhatsApp
                  </button>
                  <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">Entrega rápida e segura</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL MENU MODAL (RESTORED & LUXURY STYLE) */}
      <AnimatePresence>
        {isFullMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-0 md:p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full h-full md:max-w-6xl md:h-[90vh] bg-[#faf7f2] shadow-2xl md:rounded-[2rem] overflow-hidden flex flex-col relative border-[8px] border-[#3D1508]/10"
              style={{ 
                backgroundColor: siteContent.menu_style?.bg_color || "#faf7f2",
                borderColor: (siteContent.menu_style?.accent_color || "#3D1508") + "1A"
              }}
            >
              {/* Decorative Corner Swirls */}
              <div className="absolute top-0 left-0 w-32 h-32 opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current" style={{ color: siteContent.menu_style?.accent_color || "#3D1508" }}>
                  <path d="M0,0 C20,0 40,10 50,30 C60,50 50,70 30,80 C10,90 0,80 0,60 L0,0 Z" />
                </svg>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none transform rotate-90">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current" style={{ color: siteContent.menu_style?.accent_color || "#3D1508" }}>
                  <path d="M0,0 C20,0 40,10 50,30 C60,50 50,70 30,80 C10,90 0,80 0,60 L0,0 Z" />
                </svg>
              </div>

              <header className="p-8 md:p-12 border-b border-[#3D1508]/5 flex items-center justify-between sticky top-0 bg-[#faf7f2]/90 backdrop-blur-md z-20">
                <div className="flex-1 text-center">
                  <h2 
                    className="font-['Great_Vibes'] text-5xl md:text-7xl font-normal"
                    style={{ color: siteContent.menu_style?.title_color || "#3D1508" }}
                  >
                    {siteContent.menu_style?.main_title || "Cardápio"}
                  </h2>
                  <div className="flex items-center justify-center gap-4 mt-4 opacity-30">
                    <div className="h-[1px] w-12 md:w-20 bg-current" style={{ color: siteContent.menu_style?.accent_color || "#3D1508" }}></div>
                    <Star size={12} className="fill-current" style={{ color: siteContent.menu_style?.accent_color || "#3D1508" }} />
                    <div className="h-[1px] w-12 md:w-20 bg-current" style={{ color: siteContent.menu_style?.accent_color || "#3D1508" }}></div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsFullMenuOpen(false)} 
                  className="absolute right-6 top-6 p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X size={32} className="text-[#3D1508]" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar">
                <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-16">
                    {Array.from(new Set(products.map(p => p.category || "Variados"))).map((catName, idx) => {
                      const categoryProducts = products.filter(p => (p.category || "Variados") === catName);
                      return (
                        <div key={catName} className="flex flex-col">
                          <div className="flex items-center gap-4 mb-10 group">
                            <div className="flex-1 h-[1px] bg-[#3D1508]/10 group-hover:bg-primary/30 transition-colors"></div>
                            <h3 
                              className="font-['Great_Vibes'] text-4xl md:text-5xl whitespace-nowrap px-4"
                              style={{ color: siteContent.menu_style?.section_color || "#8B0000" }}
                            >
                              {catName}
                            </h3>
                            <div className="flex-1 h-[1px] bg-[#3D1508]/10 group-hover:bg-primary/30 transition-colors"></div>
                          </div>

                          <div className="space-y-10">
                            {categoryProducts.map((product) => (
                              <div key={product.id} className="flex gap-6 group items-start">
                                {product.image_url && (
                                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border-2 border-white transform transition-transform group-hover:scale-105 group-hover:rotate-2">
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                  </div>
                                )}
                                <div className="flex-1 flex flex-col pt-1">
                                  <div className="flex items-baseline justify-between gap-4 mb-2">
                                    <h4 
                                      className="font-serif text-lg md:text-xl font-bold leading-tight"
                                      style={{ color: siteContent.menu_style?.item_name_color || "#3D1508" }}
                                    >
                                      {product.name}
                                    </h4>
                                    <div className="flex-1 border-b border-dotted border-[#3D1508]/20 h-0 mx-2 opacity-50"></div>
                                    <span 
                                      className="font-serif font-bold text-lg whitespace-nowrap"
                                      style={{ color: siteContent.menu_style?.price_color || "#8B0000" }}
                                    >
                                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 leading-relaxed italic line-clamp-2 mb-4">
                                    {product.description}
                                  </p>
                                  <button 
                                    onClick={() => addToCart(product)}
                                    className="self-start flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors"
                                  >
                                    <Plus size={14} /> Adicionar à Sacola
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {cartCount > 0 && (
                <div className="p-8 bg-white/50 backdrop-blur-md border-t border-[#3D1508]/10 flex flex-col md:flex-row items-center justify-between gap-6 z-20">
                  <div className="text-center md:text-left">
                    <p className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-1">Total na Sacola</p>
                    <p className="text-3xl font-serif font-bold text-[#3D1508]">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal)}
                    </p>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button 
                      onClick={() => setIsFullMenuOpen(false)}
                      className="flex-1 md:flex-none px-8 py-4 rounded-xl border border-[#3D1508]/20 font-bold uppercase text-xs tracking-[0.2em] hover:bg-black/5 transition-all"
                    >
                      Continuar Vendo
                    </button>
                    <button 
                      onClick={() => { setIsFullMenuOpen(false); setIsCartOpen(true); }}
                      className="flex-1 md:flex-none px-12 py-4 rounded-xl bg-primary text-white font-bold uppercase text-xs tracking-[0.2em] shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                    >
                      <ShoppingBag size={18} /> Ver Sacola ({cartCount})
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Button({ children, className, variant = "default", ...props }: any) {
  const variants: any = {
    default: "bg-primary text-white",
    outline: "border border-primary text-primary hover:bg-primary/5",
  };
  return (
    <button className={`px-6 py-2 font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
