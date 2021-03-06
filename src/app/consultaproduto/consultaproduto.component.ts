import { SubCategoria } from './shared/subCategoria.model';
import { StatusProduto } from './shared/statusProduto.model';
import { CategoriaProduto } from './shared/categoriaProduto.model';
import { Produto } from './shared/produto.model';
import { Component, OnInit } from '@angular/core';
import { EstoqueResponse } from './shared/estoqueResponse.model';
import { Estoque } from './shared/estoque.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsultaprodutoService } from './shared/consultaproduto.service';
import { Cliente } from '../relatoriocliente/shared/cliente.model';

@Component({
  selector: 'app-consultaproduto',
  templateUrl: './consultaproduto.component.html',
  styleUrls: ['./consultaproduto.component.css']
})
export class ConsultaprodutoComponent implements OnInit {

  block: boolean = false;

  estoqueResponse: EstoqueResponse = {
    status: null,
    mensagem: null,
    retorno: []
  }

  categoria: CategoriaProduto ={
    idCategoria: null,
    dsCategoria: null,
  }

  statusProduto: StatusProduto = {
    idStatusProduto: null,
    dsStatusProduto: null,
  }

  subCategoria: SubCategoria = {
    idSubCategoria: null,
    dsSubCategoria: null,
  }


  produtoDesc: Produto={
    cdProduto: null,
    statusProduto: this.statusProduto,
    categoria: this.categoria,
    idTipoProduto: null,
    nmFantasia: null,
    nmFabricante: null,
    vlUnidade: null,
    dsProduto: null,
    lmpmItem: null,
    subCategoria: this.subCategoria,
  };

  dados: string;
  cliente: Cliente = JSON.parse(localStorage['cliente']);

 mousePass: number;

  constructor(
    private consultaProdutoService: ConsultaprodutoService,
    private route: ActivatedRoute,
    private router: Router,) { }

  ngOnInit(): void {
    this.dados = this.route.snapshot.paramMap.get('produto');
     if(Number(this.dados)){
      this.consultaProdutoService.getBuscarProdutoCodigo(this.dados).subscribe(response =>{
        this.estoqueResponse = response;
        console.log(this.estoqueResponse);
      });
    } else {
    this.consultaProdutoService.getBuscarProdutoNome(this.dados).subscribe(response =>{
      this.estoqueResponse = response;
      console.log(this.estoqueResponse);
    });
  }

  this.cliente = JSON.parse(localStorage['cliente']);
  if(this.cliente.idCliente == null){
    this.block = true;
  }


  }
  produtoDescricao(id: number){
    this.mousePass = id;
    this.estoqueResponse.retorno.forEach(element => {
        if(id == element.cdEstoque){
          this.produtoDesc = element.produto;
          console.log(this.produtoDesc);
        }
    });
  }

}
