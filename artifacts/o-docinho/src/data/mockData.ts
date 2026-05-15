import imgCoco from "@assets/photo_4911225503490968640_y_1778849244649.jpg";
import imgChocBrig from "@assets/photo_4911225503490968631_y_1778849244650.jpg";
import imgMorango from "@assets/photo_4911225503490968632_y_1778849244651.jpg";
import imgGranulado from "@assets/photo_4911225503490968633_y_1778849244652.jpg";
import imgFlatlay from "@assets/photo_4911225503490968634_y_1778849244652.jpg";
import imgTrufado from "@assets/photo_4911225503490968635_y_1778849244652.jpg";
import imgRow4 from "@assets/photo_4911225503490968638_y_1778849244653.jpg";
import imgPerolas from "@assets/photo_4911225503490968639_y_1778849244653.jpg";
import imgKitKat from "@assets/photo_4911225503490968644_y_1778849244654.jpg";
import imgVanGogh from "@assets/photo_4911225503490968647_y_1778849244654.jpg";
import imgLadyBug from "@assets/photo_4911225503490968648_y_1778849244654.jpg";
import imgLattice from "@assets/photo_4911225503490968641_y_1778849244655.jpg";
import imgGrid12 from "@assets/photo_4911225503490968649_y_(1)_1778849244655.jpg";
import imgMetallic from "@assets/photo_4911225503490968642_y_1778849244655.jpg";
import imgRedVelvet from "@assets/photo_4911225503490968643_y_(1)_1778849244656.jpg";
import imgPinkRoses from "@assets/photo_4911225503490968645_y_1778849244656.jpg";
import imgChocBow from "@assets/photo_4911225503490968646_y_1778849244656.jpg";

export const categories = [
  { id: 1, name: "Clássicos", image: imgFlatlay },
  { id: 2, name: "Gourmet", image: imgCoco },
  { id: 3, name: "Bolos Decorados", image: imgPinkRoses },
  { id: 4, name: "Sobremesas", image: imgRedVelvet },
  { id: 5, name: "Fitness", image: imgGrid12 },
];

export const bestSellers = [
  { id: 1, name: "Brigadeiro de Coco", rating: 5, price: 150, originalPrice: 190, image: imgCoco },
  { id: 2, name: "Brigadeiro Clássico", rating: 5, price: 120, originalPrice: 150, image: imgChocBrig },
  { id: 3, name: "Brigadeiro de Morango", rating: 4, price: 130, originalPrice: 160, image: imgMorango },
  { id: 4, name: "Brigadeiro Granulado", rating: 5, price: 125, originalPrice: 155, image: imgGranulado },
  { id: 5, name: "Brigadeiro Trufado", rating: 5, price: 160, originalPrice: 200, image: imgTrufado },
  { id: 6, name: "Brigadeiro de Pérolas", rating: 4, price: 170, originalPrice: 210, image: imgPerolas },
];

export const cakeGallery = [
  { id: 1, name: "Bolo Rafaello Clássico", image: imgLattice, description: "Bolo coberto com creme de coco e amêndoas, decorado com bolinhos Rafaello. Elegância em cada fatia." },
  { id: 2, name: "Bolo Red Velvet Frutas", image: imgRedVelvet, description: "Camadas de red velvet úmido com creme de queijo e frutas vermelhas frescas. Um clássico irresistível." },
  { id: 3, name: "Bolo Arte Noite Estrelada", image: imgVanGogh, description: "Decoração artística inspirada em Van Gogh. Uma obra de arte comestível, única e inesquecível." },
  { id: 4, name: "Bolo Metalizado Rosê", image: imgMetallic, description: "Acabamento metalizado com efeito espelho rosê. Glamour e sofisticação para ocasiões muito especiais." },
  { id: 5, name: "Bolo de Rosas Premium", image: imgPinkRoses, description: "Pétalas de chantilly modeladas à mão, criando um buquê de rosas eterno e delicioso." },
  { id: 6, name: "Bolo Personalizado", image: imgLadyBug, description: "100% personalizável para o tema da sua festa. Conte-nos o seu sonho e nós o realizamos." },
];

export const giftKits = [
  { id: 1, name: "Kit Festa Completo", description: "Bolo especial com brigadeiros sortidos para celebrar com quem você ama", price: 350, image: imgKitKat },
  { id: 2, name: "Caixa de Presentes Luxo", description: "A experiência mais doce em embalagem premium com laço de cetim", price: 280, image: imgChocBow },
  { id: 3, name: "Kit Degustação Sortida", description: "Uma seleção exclusiva dos nossos sabores mais amados", price: 190, image: imgFlatlay },
];

export const socialPosts = [
  { id: 1, image: imgRow4, hasVideo: true },
  { id: 2, image: imgFlatlay, hasVideo: false },
  { id: 3, image: imgGrid12, hasVideo: true },
  { id: 4, image: imgKitKat, hasVideo: true },
  { id: 5, image: imgPerolas, hasVideo: false },
];

export const testimonials = [
  {
    id: 1,
    name: "Ana Carolina Silva",
    city: "São Paulo, SP",
    rating: 5,
    text: "O bolo de casamento foi absolutamente perfeito. Cada detalhe transmitiu elegância e o sabor superou todas as expectativas. Os nossos convidados ainda falam sobre isso meses depois!",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Beatriz Fernandes",
    city: "Rio de Janeiro, RJ",
    rating: 5,
    text: "Encomendei o Kit Festa Completo para o aniversário da minha filha e foi um sucesso absoluto. A apresentação é de luxo e os doces são simplesmente divinos. Já se tornaram os meus favoritos!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Mariana Costa",
    city: "Belo Horizonte, MG",
    rating: 5,
    text: "Os brigadeiros são genuinamente os melhores que já provei. A qualidade e o carinho em cada um se sentem na primeira mordida. A O Docinho elevou o padrão da confeitaria artesanal.",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Juliana Mendes",
    city: "Curitiba, PR",
    rating: 5,
    text: "Presenteei minha mãe com a Caixa de Presentes Luxo e ela chorou de emoção ao abrir. A embalagem é linda e os doces são feitos com tanto carinho que se sente em cada mordida. Vale cada centavo.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "Fernanda Oliveira",
    city: "Porto Alegre, RS",
    rating: 5,
    text: "O Bolo Red Velvet é uma obra de arte comestível. Fresco, leve, com um equilíbrio perfeito. A entrega foi pontual e a embalagem impecável. Voltarei sempre!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
  }
];
