import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, User, Heart, ShoppingCart, Menu, Star, Play, Truck, BookOpen, Users, Leaf, X } from "lucide-react";
import { FaInstagram, FaFacebookF, FaPinterest } from "react-icons/fa";
import { categories, bestSellers, cakeGallery, giftKits, socialPosts } from "../data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const { toast } = useToast();

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
              <span className="font-serif italic text-2xl md:text-3xl text-primary font-bold">O docinho</span>
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
      <section id="cardapio" className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">O que o teu coração deseja?</h2>
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
                <div className="relative overflow-hidden mb-4 rounded-t-[50%] rounded-b-2xl transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-lg aspect-[3/4]">
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                </div>
                <h3 className="text-center font-serif text-xl font-medium group-hover:text-primary transition-colors">{category.name}</h3>
              </motion.div>
            ))}
          </motion.div>
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
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl border-2 border-dashed border-primary/30 relative"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
            
            <div className="md:w-3/5 bg-primary p-10 text-white flex flex-col justify-center relative">
              <h3 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-secondary">O Ticket Mágico</h3>
              <p className="text-xl font-light mb-4">Desbloqueie sabores exclusivos</p>
              <p className="text-primary-foreground/80 text-sm">Utilize este cupom na sua primeira compra e ganhe 15% de desconto em qualquer pedido acima de R$ 100. Uma pequena magia para adoçar o seu dia.</p>
            </div>
            
            <div className="md:w-2/5 bg-white p-10 flex flex-col items-center justify-center border-t-2 md:border-t-0 md:border-l-4 border-dashed border-muted">
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
      <section id="kits" className="py-24 bg-[#111111] text-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-secondary">Kits & Presentes Exclusivos</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Surpreenda quem você ama com experiências completas em caixas luxuosas.</p>
            <div className="w-24 h-[2px] bg-primary mx-auto mt-6"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {giftKits.map((kit) => (
              <motion.div 
                key={kit.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#1a1a1a] rounded-2xl border border-secondary/20 overflow-hidden flex flex-col group hover:border-secondary/60 transition-colors"
              >
                <div className="aspect-[5/4] overflow-hidden">
                  <img src={kit.image} alt={kit.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="font-serif text-2xl font-bold mb-2">{kit.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-grow">{kit.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-secondary font-bold text-2xl">R$ {kit.price}</span>
                    <button 
                      onClick={() => addToCart(kit.name)}
                      className="border border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-medium px-6 py-2 rounded-full transition-all active:scale-95"
                    >
                      Encomendar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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

      {/* SOCIAL FEED */}
      <section id="social" className="py-20 bg-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">O que está no teu coração?</h2>
            <p className="text-primary font-medium">@odocinho_oficial</p>
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

      {/* FOOTER */}
      <footer id="contato" className="bg-[#180810] text-white pt-20 pb-10">
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
              &copy; 2024 O Docinho. Todos os direitos reservados.
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
