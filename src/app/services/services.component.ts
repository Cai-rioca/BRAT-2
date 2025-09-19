import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  searchTerm: string = '';
  filtroAtual: string = 'todos';

  filtros = [
    { tipo: 'todos', label: 'Todos' },
    { tipo: 'brecho', label: 'Brechós' },
    { tipo: 'bazaar', label: 'Bazares' },
    { tipo: 'completa', label: 'Completas' },
    { tipo: 'online', label: 'Online' },
  ];

  lojas = [
    { nome: "Estilo Retrô", tipo: "brecho", endereco: "Rua Tal, 123" },
    { nome: "Bazar Popular", tipo: "bazaar", endereco: "Av. Principal, 456" },
    { nome: "Fashion Plus", tipo: "completa", endereco: "Rua X, 789" },
    { nome: "Trend Online", tipo: "online", link: "https://trend.com" },
    { nome: "Garimpo Ipanema", tipo: "brecho", endereco: "Rua Visconde de Pirajá, 100" },
    { nome: "Bazar da Lapa", tipo: "bazaar", endereco: "Arcos da Lapa, stand 5" },
    { nome: "Marola Completa", tipo: "completa", endereco: "Posto 9, Ipanema" },
    { nome: "Carioca Clicks", tipo: "online", link: "https://cariocaclicks.com" },
    { nome: "Achados da Urca", tipo: "brecho", endereco: "Pista Cláudio Coutinho, 333" },
    { nome: "Cyber Vintage", tipo: "brecho", endereco: "Av. Digital, 2000" },
    { nome: "Neo Bazaar", tipo: "bazaar", endereco: "Rua Futura, 404" }
  ];

  // Método correto que será chamado no input
  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
  }

  // Getter que filtra as lojas baseado no filtro atual e no searchTerm
  get lojasFiltradas() {
    return this.lojas
      .filter(loja => this.filtroAtual === 'todos' || loja.tipo === this.filtroAtual)
      .filter(loja => {
        const termo = this.searchTerm;
        return loja.nome.toLowerCase().includes(termo) ||
               (loja.endereco && loja.endereco.toLowerCase().includes(termo));
      });
  }

  setFiltro(tipo: string) {
    this.filtroAtual = tipo;
    this.searchTerm = ''; // limpa a busca ao mudar filtro
  }
}
