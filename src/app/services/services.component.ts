import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Loja {
  nome: string;
  tipo: string;
  endereco?: string;
  link?: string;
}

@Component({
  selector: 'app-catalogo-lojas',
  templateUrl: 'services.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['services.component.css']
})
export class ServicesComponent {

  searchTerm: string = '';
  filtroAtual: string = 'todos';

  tipos = [
    { label: 'Todos', value: 'todos' },
    { label: 'Brechós', value: 'brecho' },
    { label: 'Bazares', value: 'bazar' },
    { label: 'Completas', value: 'completa' },
    { label: 'Online', value: 'online' },
  ];

  lojas: Loja[] = [
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

  get lojasFiltradas(): Loja[] {
    let filtradas = this.lojas;

    if (this.filtroAtual !== 'todos') {
      filtradas = filtradas.filter(l => l.tipo === this.filtroAtual);
    }

    if (this.searchTerm.trim() !== '') {
      const termo = this.searchTerm.trim().toLowerCase();
      filtradas = filtradas.filter(l =>
        (l.nome?.toLowerCase().includes(termo)) ||
        (l.endereco?.toLowerCase().includes(termo))
      );
    }

    return filtradas;
  }

  setFiltro(tipo: string) {
    this.filtroAtual = tipo;
    this.searchTerm = '';
  }
}
