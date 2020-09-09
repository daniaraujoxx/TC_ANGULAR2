import { Component, OnInit, ViewChild, ElementRef, TestabilityRegistry } from '@angular/core';
import { NfResponse } from "./shared/nfResponse.model";
import { DevolucaoService } from "./shared/devolucao.service";
import { stringify } from '@angular/compiler/src/util';
import { NF } from './shared/nf.model';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Operador } from '../login/login/shared/operador.model';
import { Operacao } from './shared/operacao.model';
import { Filial } from './shared/filial.model';
import { Cliente } from '../relatoriocliente/shared/cliente.model';
import { MotivoNf } from './shared/motivoNf.model';


@Component({
  selector: 'app-devolucao',
  templateUrl: './devolucao.component.html',
  styleUrls: ['./devolucao.component.css']
})
export class DevolucaoComponent implements OnInit {

  @ViewChild('inputNf') nrNfElement: ElementRef;
  @ViewChild('dtCupom') dataCupom: ElementRef;
  @ViewChild('motivo') motivo: ElementRef;
  @ViewChild('caixa') caixa: ElementRef;



  operador: Operador = JSON.parse(localStorage['operador']);


  nfGravada: NfResponse;


  nf: NF = {

    idDocumentoFiscal: null,
    operacao: null,
    filial: null,
    cliente: null,
    motivo: null,
    idDocumentoFiscalVenda: null,
    nrNumeroItem: [],
    dataAbertura: null,
    dataFechamento: null,
    flagNota: null,
    valorDocumento: null,
    numeroCaixa: null,
    itens: [],
    tipoPagamento: null,
    notaDevolvida: null

  };

  filialDevolucao: Filial = {
  cdFilial: null,
  nmFilial: null,
  nrCNPJ: null,
  nrTelefoneFilial: null
}
  clienteDevolucao: Cliente = {
idCliente: null,
nmCliente: null,
dsEmail: null,
dtCadastro: null,
nrCPF: null,
nrRg: null,
dtNascimento: null,
dsGenero: null,
nrTelefoneCliente: null,
categoriaClienteDTO: null,
enderecos: []

  }

  motivoDevolucao: MotivoNf = {

    idMotivo: null
  }

  operacaoDevolucao: Operacao = {

    cdOperacao: 3,
    tipoOperacao: null,
    descricaoOperacao: null

  };

  nfDevolucao: NF = {

    idDocumentoFiscal: null,
    operacao: this.operacaoDevolucao,
    filial: this.filialDevolucao,
    cliente: this.clienteDevolucao,
    motivo: this.motivoDevolucao,
    idDocumentoFiscalVenda: null,
    nrNumeroItem: [],
    dataAbertura: null,
    dataFechamento: null,
    flagNota: null,
    valorDocumento: null,
    numeroCaixa: null,
    itens: [],
    tipoPagamento: null,
    notaDevolvida: null

  };



  nfResponse: NfResponse = {
    status: null,
    mensagem: null,
    retorno: this.nf
  };


  tipoDevolucao = false;

  constructor(private devolucaoService: DevolucaoService, public datepipe: DatePipe) {


  }


  ngOnInit(): void {
  }

  consultarNF() {
    let dados: string = this.nrNfElement.nativeElement.value;

    this.devolucaoService.getNotaFiscal(dados).subscribe(response => {
      this.nfResponse = response;
      this.dataCupom.nativeElement.value = this.datepipe.transform(this.nfResponse.retorno.dataAbertura, 'yyyy-MM-dd');
      console.log(this.nfResponse);
    })


  }

  gravarDevolucao(){
    console.log(this.tipoDevolucao);
    if(!this.tipoDevolucao){
      this.nfDevolucao.filial.cdFilial = this.operador.cdFilial;
      this.nfDevolucao.cliente.idCliente = this.nfResponse.retorno.cliente.idCliente;
      this.nfDevolucao.motivo.idMotivo = this.motivo.nativeElement.value;
      this.nfDevolucao.idDocumentoFiscalVenda = this.nfResponse.retorno.idDocumentoFiscal;

      let valor = 0;
      this.nfResponse.retorno.itens.forEach(element =>
      {
        this.nfDevolucao.nrNumeroItem.push(element.numItemDocumento);
        valor+= (element.produto.vlUnidade * element.qtItem);
       });

       let dataAtual = new Date();

       this.nfDevolucao.dataAbertura = this.datepipe.transform(dataAtual, 'yyyy-MM-dd');
       this.nfDevolucao.dataFechamento = this.datepipe.transform(dataAtual, 'yyyy-MM-dd');
       this.nfDevolucao.flagNota = 0;
       this.nfDevolucao.valorDocumento = valor;
       this.nfDevolucao.numeroCaixa = this.caixa.nativeElement.value;
       this.nfDevolucao.itens = this.nfResponse.retorno.itens;
       console.log(this.nfDevolucao);
       this.devolucaoService.postNotaFiscal(this.nfDevolucao).subscribe(response =>{
         this.nfGravada = response;
      
        },
        error =>{
          console.log(error)
        }
        )
        
      }

    }
}

