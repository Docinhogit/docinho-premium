import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, User, Heart, ShoppingCart, Menu, Star, Play, Truck, BookOpen, Users, Leaf, X, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { FaInstagram, FaFacebookF, FaPinterest } from "react-icons/fa";
import { categories, bestSellers, cakeGallery, giftKits, socialPosts, testimonials } from "../data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [flippedKits, setFlippedKits] = useState<Set<number>>(new Set());
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevTestimonial = () => setActiveTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
  const nextTestimonial = () => setActiveTestimonial(prev => (prev + 1) % testimonials.length);

  const toggleFlip = useCallback((id: number) => {
    setFlippedKits(prev => {
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

  const addToCart = (productName: string) => {
    setCartItems(prev => prev + 1);
    toast({
      title: "Adicionado ao carrinho",
      description: `${productName} foi adicionado com sucesso!`,
      duration: 3000,
    });
  };

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
            <a href="#home" className="flex flex-col items-center">
              <span className="font-serif italic text-2xl md:text-3xl text-secondary font-bold">O docinho</span>
              <span className="w-12 h-[2px] bg-secondary mt-1 rounded-full"></span>
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Home', 'Cardápio', 'Galeria de Bolos', 'Kits', 'Contato'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-').replace('á', 'a')}`} className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            <button className="hover:text-primary transition-colors hidden sm:block"><Search size={20} /></button>
            <button className="hover:text-primary transition-colors hidden sm:block"><User size={20} /></button>
            <button className="hover:text-primary transition-colors hidden sm:block"><Heart size={20} /></button>
            <button className="hover:text-primary transition-colors relative">
              <ShoppingCart size={20} />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartItems}
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
              {['Home', 'Cardápio', 'Galeria de Bolos', 'Kits', 'Contato'].map((item) => (
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

      {/* HERO SECTION */}
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
              A Verdadeira <br/> <span className="text-primary italic">Experiência</span> do <br/> Doce Caseiro
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-lg md:text-xl mb-10 font-light">
              Cada mordida é uma viagem. Nossas receitas combinam a sofisticação da confeitaria francesa com o calor e a paixão da tradição brasileira.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <a href="#cardapio" className="inline-block bg-secondary text-secondary-foreground font-semibold px-10 py-4 rounded-full hover:bg-secondary/90 hover:scale-105 active:scale-95 transition-all shadow-md">
                Comprar Agora
              </a>
            </motion.div>
          </motion.div>

          <div className="relative hidden md:block h-[500px]">
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-3/4 h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
            >
              <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop" alt="Bolo decorado" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div 
              animate={{ y: [0, 15, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-0 left-0 w-1/2 h-[300px] rounded-3xl overflow-hidden shadow-xl border-4 border-white"
            >
              <img src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop" alt="Brigadeiro Gourmet" className="w-full h-full object-cover" />
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

      {/* CATEGORIES SECTION */}
      <section id="cardapio" className="pt-24 pb-28 relative overflow-visible" style={{ background: "#3D1508" }}>
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-white">O que o teu coração deseja?</h2>
            <div className="w-24 h-[2px] bg-secondary mx-auto"></div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-5 gap-6 snap-x"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={fadeInUp} className="min-w-[200px] md:min-w-0 flex-1 snap-center group cursor-pointer">
                <div className="relative overflow-hidden mb-4 rounded-t-[50%] rounded-b-2xl transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl aspect-[3/4] border-2 border-white/10 group-hover:border-secondary/50">
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                </div>
                <h3 className="text-center font-serif text-xl font-medium text-white/90 group-hover:text-secondary transition-colors">{category.name}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Chocolate drip flowing into next section */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none z-10" style={{ transform: "translateY(98%)" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            width="100%"
            height="120"
            preserveAspectRatio="none"
            style={{ display: "block" }}
          >
            <path
              d="M0,0 L1440,0 L1440,30
              Q1385,95 1330,30
              Q1275,55 1220,30
              Q1150,115 1080,30
              Q1025,65 970,30
              Q900,100 830,30
              Q775,52 720,30
              Q655,110 590,30
              Q530,70 470,30
              Q400,108 330,30
              Q275,58 220,30
              Q150,115 80,30
              Q40,85 0,30
              Z"
              fill="#3D1508"
            />
          </svg>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section id="mais-vendidos" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Favoritos dos Nossos Clientes</h2>
            <div className="w-24 h-[2px] bg-secondary mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            {bestSellers.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all group flex flex-col h-full"
              >
                <div className="relative rounded-xl overflow-hidden mb-4 aspect-square">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Star size={12} className="fill-secondary text-secondary" />
                    <span className="text-xs font-bold">{product.rating}.0</span>
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <div className="flex items-end gap-2 mb-4 mt-auto">
                  <span className="text-primary font-bold text-xl">R$ {product.price}</span>
                  <span className="text-muted-foreground line-through text-sm mb-1">R$ {product.originalPrice}</span>
                </div>
                <button 
                  onClick={() => addToCart(product.name)}
                  className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <ShoppingCart size={18} />
                  Adicionar
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Scrolling sweets background */}
        <div className="absolute inset-0 flex flex-col justify-between gap-4 py-2 pointer-events-none select-none">
          {/* Row 1 — left */}
          <div className="flex gap-4 animate-marquee-left w-max">
            {[...bestSellers, ...cakeGallery, ...bestSellers, ...cakeGallery].map((item, i) => (
              <img
                key={i}
                src={item.image}
                alt=""
                className="h-32 w-32 object-cover rounded-2xl flex-shrink-0 opacity-90"
              />
            ))}
          </div>
          {/* Row 2 — right */}
          <div className="flex gap-4 animate-marquee-right w-max">
            {[...cakeGallery, ...bestSellers, ...cakeGallery, ...bestSellers].map((item, i) => (
              <img
                key={i}
                src={item.image}
                alt=""
                className="h-32 w-32 object-cover rounded-2xl flex-shrink-0 opacity-90"
              />
            ))}
          </div>
          {/* Row 3 — left again */}
          <div className="flex gap-4 animate-marquee-left w-max" style={{ animationDuration: "35s" }}>
            {[...bestSellers, ...cakeGallery, ...bestSellers, ...cakeGallery].map((item, i) => (
              <img
                key={i}
                src={item.image}
                alt=""
                className="h-32 w-32 object-cover rounded-2xl flex-shrink-0 opacity-90"
              />
            ))}
          </div>
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#2C1006]/80 backdrop-blur-[2px]" />

        {/* Content */}
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10"
          >
            <div className="md:w-3/5 bg-white/10 backdrop-blur-md p-10 text-white flex flex-col justify-center relative">
              {/* Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
              <h3 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-secondary">O Ticket Mágico</h3>
              <p className="text-xl font-light mb-4 text-white">Desbloqueie sabores exclusivos</p>
              <p className="text-white/70 text-sm leading-relaxed">Utilize este cupom na sua primeira compra e ganhe 15% de desconto em qualquer pedido acima de R$ 100. Uma pequena magia para adoçar o seu dia.</p>
            </div>

            <div className="md:w-2/5 bg-white/95 backdrop-blur-md p-10 flex flex-col items-center justify-center border-t-2 md:border-t-0 md:border-l-4 border-dashed border-secondary/30">
              <div className="border-2 border-dashed border-secondary/50 bg-secondary/10 px-6 py-3 rounded-lg mb-6">
                <span className="font-mono text-2xl font-bold tracking-widest text-foreground">DOCINHO15</span>
              </div>
              <button className="bg-secondary text-secondary-foreground font-bold px-8 py-3 rounded-full hover:bg-secondary/90 hover:scale-105 active:scale-95 transition-all w-full">
                Resgatar Desconto
              </button>
            </div>
          </motion.div>
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
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Galeria de Bolos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Obras de arte comestíveis criadas para tornar os seus momentos mais memoráveis ainda mais especiais.</p>
            <div className="w-24 h-[2px] bg-secondary mx-auto mt-6"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {cakeGallery.map((cake) => (
              <motion.div 
                key={cake.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden group aspect-[4/3] cursor-pointer"
              >
                <img src={cake.image} alt={cake.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                  <h3 className="text-white font-serif text-2xl font-bold mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{cake.name}</h3>
                  <button className="bg-white text-foreground px-6 py-2 rounded-full font-medium text-sm hover:bg-secondary hover:text-secondary-foreground transition-colors translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    Ver Detalhes
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GIFT KITS */}
      <section id="kits" className="py-28 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1A0805 0%, #2C1006 50%, #1A0805 100%)" }}>
        {/* Decorative gold orbs */}
        <div className="absolute top-20 left-[-80px] w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #C9A84C, transparent)" }}></div>
        <div className="absolute bottom-20 right-[-80px] w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #C9A84C, transparent)" }}></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-6"
          >
            <p className="text-secondary uppercase tracking-[0.3em] text-xs font-semibold mb-4">Coleção Exclusiva</p>
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-5 text-white">
              Kits &amp; <span className="text-secondary italic">Presentes</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
              Cada caixa é uma obra de arte. Passe o mouse para descobrir o que há dentro.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="h-px w-16 bg-secondary/40"></div>
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <div className="h-px w-16 bg-secondary/40"></div>
            </div>
          </motion.div>

          {/* Flip Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {giftKits.map((kit, index) => {
              const isFlipped = flippedKits.has(kit.id);
              return (
                <motion.div
                  key={kit.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group"
                  style={{ perspective: "1200px" }}
                >
                  {/* Card wrapper — flips on hover (desktop) or click (mobile) */}
                  <div
                    data-testid={`kit-card-${kit.id}`}
                    onClick={() => toggleFlip(kit.id)}
                    className="relative cursor-pointer"
                    style={{
                      transformStyle: "preserve-3d",
                      transition: "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      height: "420px",
                    }}
                    onMouseEnter={() => setFlippedKits(prev => new Set(prev).add(kit.id))}
                    onMouseLeave={() => setFlippedKits(prev => { const n = new Set(prev); n.delete(kit.id); return n; })}
                  >
                    {/* FRONT FACE */}
                    <div
                      className="absolute inset-0 rounded-2xl overflow-hidden"
                      style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                    >
                      <img
                        src={kit.image}
                        alt={kit.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Gold vignette overlay */}
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,8,5,0.85) 0%, rgba(26,8,5,0.2) 50%, transparent 100%)" }}></div>
                      {/* Gold border shimmer */}
                      <div className="absolute inset-0 rounded-2xl border border-secondary/30 group-hover:border-secondary/70 transition-colors duration-500"></div>
                      {/* Bottom label */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-secondary text-xs uppercase tracking-widest font-semibold mb-1">Exclusivo</p>
                        <h3 className="font-serif text-2xl font-bold text-white">{kit.name}</h3>
                        <div className="flex items-center gap-2 mt-3 text-white/60 text-xs">
                          <span>Passe o mouse para ver</span>
                          <div className="flex-1 h-px bg-white/20"></div>
                        </div>
                      </div>
                      {/* Corner accent */}
                      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-secondary/60 rounded-tr-lg"></div>
                      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-secondary/60 rounded-tl-lg"></div>
                    </div>

                    {/* BACK FACE */}
                    <div
                      className="absolute inset-0 rounded-2xl flex flex-col justify-between p-8"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: "linear-gradient(145deg, #3D1508 0%, #2C1006 100%)",
                        border: "1px solid rgba(201,168,76,0.4)",
                      }}
                    >
                      {/* Top gold ornament */}
                      <div className="flex flex-col items-center text-center">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="h-px w-8 bg-secondary/60"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                          <div className="h-px w-8 bg-secondary/60"></div>
                        </div>
                        <p className="text-secondary text-xs uppercase tracking-[0.3em] font-semibold mb-3">Kit Premium</p>
                        <h3 className="font-serif text-3xl font-bold text-white mb-4">{kit.name}</h3>
                        <p className="text-white/60 text-sm leading-relaxed">{kit.description}</p>
                      </div>

                      {/* Middle divider */}
                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-secondary/20"></div>
                        <div className="text-secondary text-xs">✦</div>
                        <div className="flex-1 h-px bg-secondary/20"></div>
                      </div>

                      {/* Bottom price + CTA */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-center">
                          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">A partir de</p>
                          <span className="font-serif text-4xl font-bold text-secondary">R$ {kit.price}</span>
                        </div>
                        <button
                          data-testid={`btn-encomend-kit-${kit.id}`}
                          onClick={(e) => { e.stopPropagation(); addToCart(kit.name); }}
                          className="w-full py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95"
                          style={{ background: "linear-gradient(90deg, #C9A84C, #E8C96A, #C9A84C)", color: "#1A0805" }}
                        >
                          Encomendar Agora
                        </button>
                        {/* Bottom corner accents */}
                        <div className="flex items-center gap-2 text-white/30 text-xs">
                          <span>Entrega especial disponível</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-16"
          >
            <p className="text-white/40 text-sm mb-4">Kits personalizados também disponíveis</p>
            <a href="#contato" className="inline-flex items-center gap-2 border border-secondary/50 text-secondary hover:bg-secondary/10 transition-colors px-8 py-3 rounded-full text-sm font-medium tracking-wide">
              Fale Conosco para Encomendas Especiais
            </a>
          </motion.div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-primary/5 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-primary/10">
              {[
                { icon: Truck, title: "Entrega Rápida", subtitle: "Para todo o país" },
                { icon: BookOpen, title: "Mais de 500 Receitas", subtitle: "Testadas e aprovadas" },
                { icon: Users, title: "Milhares de Pedidos", subtitle: "Clientes satisfeitos" },
                { icon: Leaf, title: "Sempre Fresco", subtitle: "Feito no dia para você" }
              ].map((badge, index) => (
                <div key={index} className={`flex flex-col items-center text-center ${index !== 0 ? 'pt-8 sm:pt-0' : ''}`}>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-primary">
                    <badge.icon size={28} />
                  </div>
                  <h4 className="font-bold text-foreground mb-1">{badge.title}</h4>
                  <p className="text-sm text-muted-foreground">{badge.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="sobre" className="py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Photo side */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Main large photo */}
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=1000&fit=crop"
                  alt="A nossa cozinha"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(44,16,6,0.4) 0%, transparent 60%)" }}></div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4 border border-muted">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Star size={24} className="fill-secondary text-secondary" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-foreground leading-none mb-0.5">+15 Anos</p>
                  <p className="text-muted-foreground text-xs">de receitas artesanais</p>
                </div>
              </div>
              {/* Gold corner accent */}
              <div className="absolute -top-4 -left-4 w-20 h-20 border-t-4 border-l-4 border-secondary/60 rounded-tl-2xl"></div>
            </motion.div>

            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="flex flex-col gap-6"
            >
              <div>
                <p className="text-secondary uppercase tracking-[0.3em] text-xs font-semibold mb-4">A Nossa História</p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
                  Feito com Amor,<br />
                  <span className="text-primary italic">Servido com Alma</span>
                </h2>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-border"></div>
                  <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0"></div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed text-base">
                Nascemos de uma paixão genuína pelos sabores da infância e pela arte da confeitaria francesa. Em 2010, a nossa fundadora Ana Luísa transformou a cozinha de casa no laboratório de receitas que hoje encanta milhares de famílias em todo o Brasil.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                Cada doce que sai da nossa cozinha carrega ingredientes selecionados, técnicas apuradas e o carinho de quem entende que um bom doce não alimenta apenas o corpo — alimenta a memória e o coração.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 py-8 border-y border-border">
                {[
                  { value: "15+", label: "Anos de receitas" },
                  { value: "8K+", label: "Pedidos entregues" },
                  { value: "500+", label: "Receitas únicas" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-serif text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-muted-foreground text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href="#cardapio"
                  className="inline-flex items-center justify-center bg-primary text-white font-semibold px-8 py-4 rounded-full hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  Ver o Cardápio
                </a>
                <a
                  href="#contato"
                  className="inline-flex items-center justify-center border border-primary text-primary font-semibold px-8 py-4 rounded-full hover:bg-primary/5 hover:scale-105 active:scale-95 transition-all"
                >
                  Fale Connosco
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SOCIAL FEED */}
      <section id="social" className="py-20 bg-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">Siga o nosso Instagram</h2>
            <p className="text-primary font-medium">@docinho.odocinho</p>
          </div>

          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 gap-4 snap-x">
            {socialPosts.map((post) => (
              <div key={post.id} className="min-w-[250px] md:min-w-0 md:w-1/5 flex-none snap-center aspect-square relative group rounded-xl overflow-hidden cursor-pointer">
                <img src={post.image} alt="Social post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                {post.hasVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-primary/80 transition-colors">
                      <Play className="text-white fill-white ml-1" size={20} />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <FaInstagram className="text-white text-3xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SLIDER */}
      <section className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #fff5f7 0%, #fff 50%, #fff9f0 100%)" }}>
        {/* Decorative large quote */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-[0.04] pointer-events-none select-none">
          <Quote size={280} className="text-primary" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <p className="text-secondary uppercase tracking-[0.3em] text-xs font-semibold mb-4">Depoimentos</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-3">O que dizem os nossos</h2>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary italic">clientes apaixonados</h2>
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="h-px w-16 bg-secondary/40"></div>
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <div className="h-px w-16 bg-secondary/40"></div>
            </div>
          </motion.div>

          {/* Slider */}
          <div className="relative max-w-4xl mx-auto">
            {/* Main card */}
            <div className="relative overflow-hidden">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white rounded-3xl shadow-xl p-10 md:p-14 border border-border/60"
              >
                {/* Quote icon */}
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                  <Quote size={20} className="text-primary" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                    <Star key={i} size={18} className="fill-secondary text-secondary" />
                  ))}
                </div>

                {/* Text */}
                <blockquote className="font-serif text-xl md:text-2xl text-foreground leading-relaxed mb-10 italic">
                  "{testimonials[activeTestimonial].text}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-secondary/40"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonials[activeTestimonial].name}</p>
                    <p className="text-muted-foreground text-sm">{testimonials[activeTestimonial].city}</p>
                  </div>
                  {/* Gold line accent */}
                  <div className="flex-1 h-px bg-gradient-to-r from-secondary/40 to-transparent ml-4 hidden md:block"></div>
                </div>
              </motion.div>
            </div>

            {/* Navigation arrows */}
            <button
              data-testid="btn-prev-testimonial"
              onClick={prevTestimonial}
              className="absolute -left-5 md:-left-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-border shadow-md flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              data-testid="btn-next-testimonial"
              onClick={nextTestimonial}
              className="absolute -right-5 md:-right-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-border shadow-md flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2.5 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                data-testid={`dot-testimonial-${i}`}
                onClick={() => setActiveTestimonial(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === activeTestimonial
                    ? "w-8 h-2.5 bg-primary"
                    : "w-2.5 h-2.5 bg-border hover:bg-primary/40"
                }`}
              />
            ))}
          </div>

          {/* Mini previews */}
          <div className="hidden md:flex items-center justify-center gap-4 mt-10">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActiveTestimonial(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                  i === activeTestimonial
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-transparent hover:border-border"
                }`}
              >
                <img src={t.avatar} alt={t.name} className="w-7 h-7 rounded-full object-cover" />
                <span className={`text-xs font-medium ${i === activeTestimonial ? "text-primary" : "text-muted-foreground"}`}>
                  {t.name.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CHOCOLATE DRIP DIVIDER */}
      <div className="relative -mt-1 leading-none overflow-hidden" style={{ background: "#1A0805", height: "110px" }}>
        <svg
          viewBox="0 0 1440 110"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 left-0 w-full"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          <path
            d="M0,0 L1440,0 L1440,30
            Q1415,30 1410,48 Q1405,70 1390,70 Q1375,70 1370,48 Q1365,30 1340,30
            Q1310,30 1305,52 Q1300,82 1283,82 Q1266,82 1261,52 Q1256,30 1228,30
            Q1200,30 1195,44 Q1190,62 1175,62 Q1160,62 1155,44 Q1150,30 1122,30
            Q1092,30 1087,58 Q1082,94 1065,94 Q1048,94 1043,58 Q1038,30 1010,30
            Q982,30 977,46 Q972,68 957,68 Q942,68 937,46 Q932,30 905,30
            Q876,30 871,60 Q866,96 849,96 Q832,96 827,60 Q822,30 796,30
            Q770,30 765,42 Q760,60 745,60 Q730,60 725,42 Q720,30 694,30
            Q666,30 661,54 Q656,86 639,86 Q622,86 617,54 Q612,30 585,30
            Q558,30 553,44 Q548,65 533,65 Q518,65 513,44 Q508,30 481,30
            Q453,30 448,56 Q443,88 426,88 Q409,88 404,56 Q399,30 372,30
            Q345,30 340,46 Q335,68 320,68 Q305,68 300,46 Q295,30 268,30
            Q240,30 235,58 Q230,92 213,92 Q196,92 191,58 Q186,30 159,30
            Q133,30 128,44 Q123,64 108,64 Q93,64 88,44 Q83,30 57,30
            Q30,30 25,52 Q20,78 5,78 Q0,78 0,78
            L0,0 Z"
            fill="#fff5f7"
          />
        </svg>
      </div>

      {/* FOOTER */}
      <footer id="contato" className="bg-[#1A0805] text-white pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-8">
          {/* Newsletter */}
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6 mb-20 border-b border-white/10 pb-16">
            <div className="md:w-1/2 text-center md:text-left">
              <h3 className="font-serif text-2xl font-bold mb-2">Não perca nossas novidades</h3>
              <p className="text-gray-400 text-sm">Receba receitas secretas e promoções exclusivas.</p>
            </div>
            <div className="md:w-1/2 w-full flex relative">
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                className="w-full bg-white/5 border border-white/20 rounded-full py-4 pl-6 pr-40 focus:outline-none focus:border-secondary transition-colors text-white placeholder:text-gray-500"
              />
              <button className="absolute right-1 top-1 bottom-1 bg-secondary text-secondary-foreground font-bold px-6 rounded-full hover:bg-secondary/90 transition-colors">
                Inscrever-se
              </button>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex flex-col items-start mb-6">
                <span className="font-serif italic text-3xl text-white font-bold mb-1">O docinho</span>
                <span className="w-12 h-[2px] bg-secondary rounded-full"></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Transformando açúcar, farinha e muito amor em momentos inesquecíveis desde 2010. O verdadeiro sabor artesanal na sua casa.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Sobre Nós</h4>
              <ul className="flex flex-col gap-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-secondary transition-colors">Nossa História</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Ingredientes</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Sustentabilidade</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Trabalhe Conosco</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Categorias</h4>
              <ul className="flex flex-col gap-3 text-gray-400 text-sm">
                <li><a href="#cardapio" className="hover:text-secondary transition-colors">Bolos Decorados</a></li>
                <li><a href="#cardapio" className="hover:text-secondary transition-colors">Doces Finos</a></li>
                <li><a href="#kits" className="hover:text-secondary transition-colors">Kits para Presente</a></li>
                <li><a href="#cardapio" className="hover:text-secondary transition-colors">Sobremesas</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Contato</h4>
              <ul className="flex flex-col gap-3 text-gray-400 text-sm">
                <li>Rua das Flores, 123 - Jardins</li>
                <li>São Paulo, SP - 01234-567</li>
                <li><a href="mailto:ola@odocinho.com" className="hover:text-secondary transition-colors">ola@odocinho.com</a></li>
                <li><a href="tel:+5511999999999" className="hover:text-secondary transition-colors">(11) 99999-9999</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; 2026 O Docinho. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
                <FaPinterest size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
