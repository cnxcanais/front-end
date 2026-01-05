import { Printer } from "@phosphor-icons/react"
import { Modal } from "./Modal"

interface PrivacyPolicyModalProps {
  open: boolean
  onClose: () => void
}

export function PrivacyPolicyModal({ open, onClose }: PrivacyPolicyModalProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Modal
      title="POLÍTICA DE PRIVACIDADE"
      open={open}
      onClose={onClose}
      size="xlarge">
      <div className="mb-4 flex justify-end">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Printer size={20} />
          Imprimir
        </button>
      </div>
      <div className="max-h-[75vh] space-y-4 overflow-y-auto pr-2 text-justify text-sm">
        <p>
          A CNX Corretora de Seguros Ltda., pessoa jurídica de direito privado,
          inscrita no CNPJ nº 04.220.149/0001-37, SUSEP nº 10041845-5, com sede
          à Rua Francisco Rocha, 198 – Batel, Curitiba/PR, CEP 80420-130, está
          comprometida em resguardar sua privacidade. O intuito desta página é
          esclarecer quais informações são coletadas dos USUÁRIOS de nosso site
          https://cnxseguros.com.br/ e respectivos serviços – e de que forma
          esses dados são manipulados e utilizados.
        </p>

        <h4 className="mt-6 font-bold">1. INFORMAÇÕES GERAIS E DEFINIÇÕES</h4>
        <p>
          A CNX valoriza a privacidade de seus USUÁRIOS e criou esta Política de
          Privacidade tem por finalidade prestar informações sobre a coleta,
          uso, armazenamento, proteção e direitos do USUÁRIO e TITULAR em
          relação a seus Dados Pessoais e Dados Pessoais Sensíveis, estando de
          acordo com a Lei de Proteção de Dados Pessoais (Lei nº 13.709/2018).
        </p>
        <p>
          A CNX segue o Código de Conduta CNX (&ldquo;Código de Conduta&rdquo;)
          que representa a missão, a visão e os valores da CNX, feito com
          objetivo de orientar e retratar quais os valores prioritários desta
          empresa desde sua concepção, sempre visando uma atuação ética de todos
          os seus funcionários.
        </p>
        <p>
          Ressalta-se que se caso o TITULAR não concorde com qualquer item deste
          instrumento, recomenda-se que não use a Plataforma ou forneça
          informações pessoais para a CNX.
        </p>

        <h5 className="mt-4 font-semibold">1.1 DEFINIÇÕES</h5>
        <p>
          1.2 A Política de Privacidade é uma declaração legal que explica como
          a CNX pode coletar e compartilhar suas informações e como o TITULAR
          pode limitar este compartilhamento de suas informações. Alguns termos
          serão vistos nesta Política de Privacidade e possuem os seguintes
          significados:
        </p>
        <p>
          a) Dados Pessoais: significa quaisquer informações fornecidas e/ou
          coletadas pela CNX e/ou suas afiliadas, por qualquer meio, ainda que
          públicos, que: (I) identifiquem, ou que, quando usadas em combinação
          com outras informações tratadas pela CNX identifiquem um indivíduo; ou
          (II) por meio das quais a identificação ou informações de contato de
          uma pessoa física possam ser derivadas. Os Dados Pessoais podem estar
          em qualquer mídia ou formato, inclusive registros eletrônicos ou
          computadorizados, bem como em arquivos baseados em papel. Os Dados
          Pessoais, no entanto, não incluem telefone comercial, número de
          celular comercial, endereço comercial, e-mail comercial.
        </p>
        <p>
          b) Dados Pessoais Sensíveis: dado pessoal sobre origem racial ou
          étnica, convicção religiosa, opinião política, filiação a sindicato ou
          a organização de caráter religioso, filosófico ou político, dado
          referente à saúde ou à vida sexual, dado genético ou biométrico,
          quando vinculado a uma pessoa natural.
        </p>
        <p>
          c) Dados de Uso: Os Dados de Uso são dados coletados automaticamente,
          gerados pelo uso da Plataforma ou dos serviços ofertados pela empresa;
        </p>
        <p>
          d) Cookies: Cookies são pequenos pedaços de dados armazenados no
          dispositivo do USUÁRIO (por exemplo, dados de sites ou links já
          visitados);
        </p>
        <p>
          (e) Controlador dos Dados: pessoa natural ou jurídica, de direito
          público ou privado, a quem competem as decisões referentes ao
          tratamento de dados pessoais;
        </p>
        <p>
          (f) Operador dos Dados: pessoa natural ou jurídica, de direito público
          ou privado, que realiza o tratamento de dados pessoais em nome do
          controlador;
        </p>
        <p>
          (g) Agentes de Tratamento: são o conjunto do qual fazem parte o
          controlador e o operador. Para os fins desta Política de Privacidade,
          a CNX faz parte dos Agentes de Tratamento de Dados, pois exerce ambos
          os papéis de Controlador e Operador, uma vez que coleta, trata, usa,
          compartilha e armazena os dados pessoais;
        </p>
        <p>
          (h) Alvo dos Dados: Alvo dos Dados ou Data Subject é qualquer
          indivíduo vivo que seja o sujeito dos Dados Pessoais;
        </p>
        <p>
          (i) USUÁRIO: O USUÁRIO é o indivíduo que usa a Plataforma ou serviços
          da CNX. O USUÁRIO corresponde ao TITULAR dos Dados, todas as pessoas
          físicas que utilizarão ou visitarão o(s) Site(s) e/ou Aplicativo(s),
          maiores de 18 (dezoito) anos ou emancipadas e totalmente capazes de
          praticar os atos da vida civil ou os absolutamente ou relativamente
          incapazes devidamente representados ou assistidos.
        </p>
        <p>
          j) Finalidade: o objetivo, o propósito que a CNX deseja alcançar a
          partir de cada ato de tratamento das informações pessoais.
        </p>
        <p>
          k) Necessidade: justificativa pelo qual é estritamente necessário
          coletar dados pessoais, para atingir a finalidade, evitando-se a
          coleta excessiva.
        </p>
        <p>
          l) Bases legais: fundamentação legal que torna legítimo o tratamento
          de dados pessoais para uma determinada finalidade prévia por parte da
          CNX.
        </p>
        <p>
          m) Consentimento: autorização expressa e inequívoca dada pelo USUÁRIO
          TITULAR do dado pessoal para que a CNX trate seus dados pessoais para
          uma finalidade previamente descrita, na qual a base legal necessária
          para o ato demande a autorização expressa do TITULAR.
        </p>
        <p>
          Esta política se aplica, em geral, a todos os USUÁRIOS e potenciais
          USUÁRIOS dos serviços oferecidos pela CNX, incluindo USUÁRIOS dos
          sites ou outros meios operados pela CNX e resume como a CNX poderá
          coletar, produzir, receptar, classificar, utilizar, acessar,
          reproduzir, transmitir, distribuir, processar, arquivar, armazenar,
          eliminar, avaliar ou controlar a informação, modificar, comunicar,
          transferir, difundir ou extrair os dados coletados, incluindo as
          informações de identificação pessoal, de acordo com as bases legais
          aplicáveis e todas as leis de privacidade e proteção de dados em
          vigor.
        </p>
        <p>
          Ao acessar e/ou utilizar o site da CNX, o USUÁRIO declara ter no
          mínimo 18 (dezoito) anos e ter capacidade plena e expressa para a
          aceitação dos termos e condições desta Política de Privacidade e do
          Termo de Consentimento para todos os fins de direito.
        </p>
        <p>
          Caso o USUÁRIO não se enquadre na descrição acima e/ou não concorde,
          ainda que em parte, com os termos e condições contidos nesta Política
          de Privacidade, não deverá acessar e/ou utilizar os serviços
          oferecidos pela CNX, bem como os sites e serviços por ela operados.
        </p>

        <h4 className="mt-6 font-bold">
          2. COLETA E USOS DE INFORMAÇÕES PESSOAIS
        </h4>
        <p>
          O USUÁRIO está ciente de que fornece informação de forma consciente e
          voluntária por meio de [FORMULÁRIO/ETC], ou por meio dos sites
          operados pela CNX.
        </p>
        <p>
          Quando o USUÁRIO realiza o cadastro e/ou preenche formulários
          oferecidos pela CNX, inclusive nos sites por ela operados,
          determinados Dados Pessoais solicitados serão mantidos em sigilo e
          serão utilizadas apenas para o propósito que motivou o cadastro,
          conforme Tabela de Finalidades.
        </p>

        <h5 className="mt-4 font-semibold">
          2.1 A CNX coleta tipos diferentes de informações para fins de
          comunicação diversas. Abaixo segue a descrição de cada tipo de dado
          coletado:
        </h5>
        <p>
          (i) Dados Pessoais: ao usar a Plataforma ou serviços da CNX, poderá
          ser solicitado o fornecimento de algumas informações pessoais
          identificáveis que podem ser usadas para contatar ou identificar os
          TITULARES. As informações pessoalmente identificáveis podem incluir,
          mas não estão limitadas a: endereço de e-mail, nome completo,
          endereço, telefone, escolaridade, dados do curriculum vitae e número
          de CPF.
        </p>
        <p>
          (ii) Dados de Uso: também poderá ser coletado informações sobre como o
          serviço é acessado e usado. Esses Dados de Uso podem incluir
          informações como o Endereço de Protocolo de Internet do computador
          (por exemplo, endereço IP) do USUÁRIO, tipo de navegador, versão do
          navegador, as páginas da Plataforma que o USUÁRIO visita, a hora e
          data de sua visita, o tempo gasto nessas páginas, identificadores de
          dispositivos (devices) e outros dados de diagnóstico.
        </p>
        <p>
          (iii) Rastreamento e Dados de Cookies: é feito o uso de cookies e
          tecnologias de rastreamento semelhantes para rastrear a atividade na
          Plataforma e manter certas informações, fazendo com que o próximo
          acesso do USUÁRIO seja mais rápido. Exemplos de cookies que a LEGAL
          HUB utiliza: cookies de sessão (para operar o serviço) e cookies de
          preferência (para lembrar preferências e configurações, como uso de
          componentes e/ou plug-ins suportados pelo navegador).
        </p>
        <h4 className="mt-6 font-bold">
          3. COMPARTILHAMENTO E TRATAMENTO DE INFORMAÇÕES PESSOAIS
        </h4>
        <p>
          A coleta e tratamento dos dados solicitados possuem as seguintes
          finalidades:
        </p>
        <p>
          a. Possibilitar que a CNX identifique e entre em contato com o TITULAR
          para fins de relacionamento comercial.
        </p>
        <p>
          b. Possibilitar que a CNX elabore contratos comerciais com o TITULAR.
        </p>
        <p>
          c. Possibilitar que a CNX estruture, teste, promova e faça propaganda
          de seus serviços, personalizados ou não ao perfil do TITULAR.
        </p>
        <p>
          d. Possibilitar que a CNX utilize tais dados em Pesquisas de Mercado;
        </p>
        <p>
          e. Possibilitar que a CNX utilize tais dados na inscrição de vagas de
          emprego e processos de seleção de trabalho;
        </p>
        <p>
          f. Possibilitar que a CNX utilize tais dados na elaboração de cotações
          de seus serviços;
        </p>
        <p>
          g. Possibilitar que a CNX utilize tais dados para suas peças de
          Comunicação;
        </p>
        <p>
          h. Possibilitar que a CNX utilize tais dados para facilitar a
          prestação de serviços diversos além dos primariamente contratados,
          desde que o TITULAR também demonstre interesse em contratar novos
          serviços;
        </p>
        <p>
          i. Possibilitar que a CNX utilize tais dados para manter banco de
          dados de profissionais do mercado para facilitar o contato em futuros
          convites para oportunidades.
        </p>
        <p>
          j. Possibilitar que a CNX contate o TITULAR dos dados com boletins
          informativos, comunicados de marketing ou promocionais.
        </p>
        <p>k. Monitorar o uso da Plataforma e manter sua disponibilidade.</p>
        <p>
          l. Detectar, prevenir e resolver problemas técnicos em nosso site ou
          serviços.
        </p>
        <p>
          m. Identificação de especificidades do USUÁRIO e apresentação da
          plataforma adaptada a seu perfil.
        </p>
        <p>n. Métricas de acesso de e-mail e de transações.</p>
        <p>o. Melhoria da experiência online do USUÁRIO.</p>
        <p>
          p. Marketing digital dentro da Plataforma exclusivamente para uso da
          CNX.
        </p>

        <p className="mt-4">
          A CNX poderá divulgar os Dados Pessoais coletados a terceiros, nas
          seguintes situações e nos limites exigidos e autorizados pela Lei:
        </p>
        <p>
          a) Com os seus clientes e parceiros quando necessário e/ou apropriado
          à prestação de serviços relacionados;
        </p>
        <p>
          b) Com as empresas e indivíduos contratados para a execução de
          determinadas atividades e serviços em nome da CNX;
        </p>
        <p>c) Com empresas do grupo;</p>
        <p>
          d) Com fornecedores e parceiros para consecução dos serviços
          contratados com a CNX (como tecnologia da informação, contabilidade,
          entre outros);
        </p>
        <p>
          e) Para propósitos administrativos como: pesquisa, planejamento,
          desenvolvimento de serviços, segurança e gerenciamento de risco.
        </p>
        <p>
          f) Quando necessário em decorrência de obrigação legal, determinação
          de autoridade competente, ou decisão judicial.
        </p>

        <p className="mt-4">
          Nas hipóteses de compartilhamento de Dados Pessoais com terceiros,
          todos os sujeitos deverão utilizar os Dados Pessoais partilhados de
          maneira consistente e de acordo com os propósitos para os quais foram
          coletados (ou com os quais o USUÁRIO consentiu previamente) e de
          acordo com o que foi determinado por esta Política de Privacidade,
          outras declarações de privacidade de website ou países, e todas as
          leis de privacidade e proteção de dados aplicáveis.
        </p>
        <h4 className="mt-6 font-bold">
          4. MOTIVOS LEGAIS PARA A DIVULGAÇÃO DE SEUS DADOS
        </h4>
        <p>
          Em certas circunstâncias, a CNX poderá divulgar Dados Pessoais, na
          medida necessária ou apropriada, para órgãos governamentais,
          consultores e outros terceiros com o objetivo de cumprir com a
          legislação aplicável ou com uma ordem ou intimação judicial ou, ainda,
          se a CNX acreditar de boa-fé que tal ação seja necessária para:
        </p>
        <p>a) Cumprir com uma legislação que exija tal divulgação;</p>
        <p>
          b) Investigar, impedir ou tomar medidas relacionadas a atividades
          ilegais suspeitas ou reais ou para cooperar com órgãos públicos ou
          para proteger a segurança nacional;
        </p>
        <p>c) Execução de seus contratos;</p>
        <p>
          d) Investigar e se defender contra quaisquer reivindicações ou
          alegações de terceiros;
        </p>
        <p>
          e) Proteger a segurança ou a integridade dos serviços (por exemplo, o
          compartilhamento com empresas que estão sofrendo ameaças semelhantes);
        </p>
        <p>
          f) Exercer ou proteger os direitos, a propriedade e a segurança da CNX
          e suas empresas coligadas;
        </p>
        <p>
          g) Proteger os direitos e a segurança pessoal de seus funcionários,
          USUÁRIOS ou do público;
        </p>
        <p>
          h) Em caso de venda, compra, fusão, reorganização, liquidação ou
          dissolução da CNX.
        </p>

        <p className="mt-4">
          O TITULAR declara estar ciente da possibilidade de armazenamento de
          dados no exterior, com a qual declaram estar de acordo. Em caso de
          armazenamento fora do território brasileiro, haverá nesse caso uma
          transferência internacional dos dados.
        </p>
        <p>
          A CNX tomará todas as medidas razoavelmente necessárias para garantir
          que os dados sejam tratados de forma confiável, segura e de acordo com
          esta Política de Privacidade, não permitindo nenhuma transferência de
          Dados Pessoais para uma organização ou país, a menos que haja
          controles adequados, incluindo a segurança de dados e outras
          informações pessoais.
        </p>

        <h4 className="mt-6 font-bold">5. SEGURANÇA DE INFORMAÇÕES PESSOAIS</h4>
        <p>
          Todas os Dados Pessoais serão guardados na base de dados da CNX ou em
          base de dados mantidas &ldquo;na nuvem&rdquo; pelos fornecedores de
          serviços contratados pela CNX, os quais estão devidamente de acordo
          com a legislação de dados vigente.
        </p>
        <p>
          A CNX e seus fornecedores utilizam vários procedimentos de segurança
          para proteger a confidencialidade, segurança e integridade de seus
          Dados Pessoais, prevenindo a ocorrência de eventuais danos em virtude
          do tratamento desses dados.
        </p>
        <p>
          Embora a CNX utilize medidas de segurança e monitore seu sistema para
          verificar vulnerabilidades e ataques para proteger seus Dados Pessoais
          contra divulgação não autorizada, mau uso ou alteração, o USUÁRIO
          entende e concorda que não há garantias de que as informações não
          poderão ser acessadas, divulgadas, alteradas ou destruídas por
          violação de qualquer uma das proteções físicas, técnicas ou
          administrativas.
        </p>

        <h4 className="mt-6 font-bold">6. RETENÇÃO DE DADOS</h4>
        <p>
          A CNX retém todos os dados fornecidos, inclusive os Dados Pessoais,
          enquanto o cadastro do USUÁRIO estiver ativo e conforme seja
          necessário para consecução de seus serviços.
        </p>
        <p>
          A CNX reterá seus Dados Pessoais e manterá seus dados armazenados até
          eventual requerimento de exclusão solicitada diretamente pelo USUÁRIO.
        </p>
        <p>
          A CNX poderá vir a manter seus Dados Pessoais após receber seu pedido
          de exclusão ou após os prazos da Tabela de Finalidades caso seja
          necessário para cumprimento de obrigações legais, resolver disputas,
          manter a segurança, evitar fraudes e abuso e garantir o cumprimento de
          contratos.
        </p>
        <h4 className="mt-6 font-bold">7. SEGURANÇA DE DADOS</h4>
        <p>
          A CNX se compromete a adotar medidas preventivas a ocorrência de
          quaisquer danos no tratamento de dados pessoais de seus USUÁRIOS,
          utilizando dessa forma medidas de segurança aptas a proteger estes
          dados do acesso de qualquer terceiro não autorizado.
        </p>
        <p>
          A CNX, conforme as recomendações regulatórias, utiliza medidas de
          segurança, técnicas e administrativas aptas a proteger os dados
          pessoais de acessos não autorizados e de situações acidentais ou
          ilícitas de destruição, perda, alteração, comunicação ou qualquer
          forma de tratamento inadequado ou ilícito.
        </p>
        <p>
          Ressalta-se que mesmo que a CNX disponha de medidas razoáveis de
          segurança administrativa, física e eletrônica, com o fim de proteger
          as informações coletadas contra a perda ou mau uso, pela própria
          natureza da internet, nenhuma transmissão de dados neste meio ou
          método de armazenamento eletrônico pode ser considerada absolutamente
          inviolável por terceiros agindo de forma ilícita e alheia ao controle
          estabelecido pela CNX Embora a CNX se esforce para usar todos os meios
          comercialmente aceitáveis para proteger os dados pessoais, não poderá
          garantir a segurança absoluta
        </p>
        <p>
          A CNX dispõe de padrões técnicos aceitáveis para tornar aplicável às
          boas práticas de governança e segurança da informação, considerados a
          natureza das informações tratadas, as características específicas do
          tratamento e o estado atual da tecnologia, especialmente no caso de
          dados pessoais sensíveis, bem como resguardar os princípios previstos
          (finalidade, adequação, livre acesso, qualidade dos dados
          transparência, segurança, prevenção, não discriminação,
          responsabilização e prestação de contas) na LGPD.
        </p>
        <p>
          As informações coletadas pela CNX estarão armazenadas em ambiente
          seguro, observado o estado da técnica disponível, valendo-se de
          políticas e tecnologias de segurança como criptografia, controles de
          acesso e certificações de segurança específicos, e somente poderão ser
          acessadas por pessoas qualificadas e autorizadas pela CNX.
        </p>

        <h4 className="mt-6 font-bold">8. BASES LEGAIS PARA PROCESSAMENTO</h4>
        <p>
          A CNX apenas trata Dados Pessoais em situações em que está autorizada
          legalmente ou mediante seu expresso e inequívoco consentimento do
          USUÁRIO.
        </p>
        <p>
          Conforme descrito na presente Política, a CNX tem bases legais para
          coletar, produzir, receptar, classificar, utilizar, acessar,
          reproduzir, transmitir, distribuir, processar, arquivar, armazenar,
          eliminar, avaliar ou controlar a informação, modificar, comunicar,
          transferir, difundir ou extrair dados sobre o USUÁRIO.
        </p>
        <p>
          As bases legais incluem seu consentimento (colhido de forma expressa e
          inequívoca no Termo de Consentimento), contratos e procedimentos
          preliminares contratuais (em que o processamento é necessário para
          firmar o contrato com o USUÁRIO) e interesses legítimos, desde que tal
          processamento não viole seus direitos e liberdades, conforme se pode
          verificar na Tabela de Finalidades.
        </p>
        <p>
          Tais interesses incluem proteger o USUÁRIO e a CNX de ameaças, cumprir
          a legislação aplicável, o exercício regular de direitos em processo
          judicial, administrativo ou arbitral, habilitar a realização ou
          administração dos negócios, incluindo controle de qualidade,
          relatórios e serviços oferecidos, gerenciar transações empresariais,
          entender e melhorar os negócios e relacionamentos com os clientes e
          permitir que os USUÁRIOS encontrem oportunidades econômicas.
        </p>
        <p>
          O USUÁRIO tem o direito de negar ou retirar o consentimento fornecido
          à CNX, quando esta for a base legal para tratamento dos dados
          pessoais, podendo a CNX encerrar a consecução de seus serviços para
          este USUÁRIO na hipótese de ocorrência de tal solicitação.
        </p>
        <p>
          Caso tenha dúvidas sobre as bases legais para coleta, tratamento e
          armazenamento de seus dados pessoais, entre em contato com a CNX e seu
          Data Protection Officer por meio do e-mail dpo@lbca.com.br.
        </p>
        <h4 className="mt-6 font-bold">
          9. DIREITO DE ACESSAR E CONTROLAR SEUS DADOS PESSOAIS
        </h4>
        <p>
          A CNX oferece ao USUÁRIO diversas opções do que fazer com seus Dados
          Pessoais coletados, tratados e armazenados, incluindo sua exclusão
          e/ou correção. O USUÁRIO pode:
        </p>
        <p>
          a) Excluir dados: o USUÁRIO pode solicitar a exclusão de alguns dos
          seus Dados Pessoais (por exemplo, se eles não são mais necessários
          para lhe fornecer os serviços).
        </p>
        <p>
          b) Alterar ou corrigir dados: o USUÁRIO pode editar ou solicitar a
          edição de alguns dos seus Dados Pessoais. O USUÁRIO também pode
          solicitar atualizações, alterações ou correções de seus dados em
          determinados casos, principalmente se eles estiverem incorretos.
        </p>
        <p>
          c) Colocar objeções, limites ou restrições ao uso de dados: o USUÁRIO
          pode solicitar a interrupção do uso de todos ou alguns de seus Dados
          Pessoais (por exemplo, se não tivermos o direito de continuar a
          usá-los), ou limitar a nossa utilização de tais dados (por exemplo, se
          seus Dados Pessoais estiverem incorretos ou armazenados ilegalmente),
          destacando-se que a CNX poderá tratar os Dados Pessoais de acordo com
          as bases legais listadas na Tabela de Finalidades.
        </p>
        <p>
          d) O USUÁRIO tem direito de acessar ou levar seus dados: o USUÁRIO
          pode solicitar uma cópia dos seus Dados Pessoais e dos dados que o
          USUÁRIO forneceu em um formato legível sob a forma impressa ou por
          meio eletrônico.
        </p>
        <p>
          O USUÁRIO pode fazer as solicitações listadas acima entrando em
          contato com o nosso Data Protection Officer por meio do e-mail
          dpo@lbca.com.br e estes pedidos serão considerados de acordo com as
          leis aplicáveis.
        </p>

        <h4 className="mt-6 font-bold">
          10. RESPONSABILIDADES, DIREITOS E DEVERES DAS PARTES
        </h4>
        <p>
          Os tratamentos de dados pessoais realizados pela CNX observarão todos
          os princípios previstos na Lei nº 13.709/2018 (Lei de Proteção de
          Dados Pessoais), agindo sempre de boa-fé.
        </p>
        <p>
          A CNX garantirá aos USUÁRIOS, TITULARES dos dados pessoais, o livre
          acesso e consulta de forma facilitada e gratuita de seus dados
          pessoais.
        </p>
        <p>
          A CNX irá armazenar a comprovação de que os TITULARES consentiram com
          o tratamento de seus dados pessoais realizado pela primeira, visto que
          possui o ônus da prova de tal fato.
        </p>
        <p>
          A CNX se compromete a manter registro de todas as operações de
          tratamento de dados pessoais que realizar.
        </p>
        <p>
          Em caso de revogação de consentimento ou exercício de seu direito de
          exclusão por parte do USUÁRIO, os dados pessoais e dados pessoais
          sensíveis serão mantidos bloqueados durante os prazos legalmente
          estabelecidos para atender às possíveis responsabilidades decorrentes
          do tratamento dos mesmos.
        </p>
        <p>
          Qualquer ocorrência de incidência de segurança aos dados pessoais dos
          USUÁRIOS que possam acarretar risco ou dano relevante será comunicada
          aos TITULARES pela CNX.
        </p>
        <p>
          Quaisquer informações que os TITULARES apresentarem serão coletadas e
          guardadas de acordo com padrões rígidos de segurança e
          confidencialidade. As informações pessoais que forem passadas à CNX
          serão coletadas por meios éticos e legais, podendo ter um ou mais
          propósitos, conforme disposto acima na sessão &ldquo;Coleta de
          Dados&rdquo;.
        </p>
        <p>
          A CNX tomará medidas razoáveis para permitir que o TITULAR solicite a
          correção, inclusão, alteração, exclusão, anonimização, bloqueio ou
          limite o uso de seus dados pessoais.
        </p>
        <p>
          O TITULAR de dados terá todos os direitos previstos na Lei Geral de
          Proteção de Dados Pessoais garantidos pela CNX, dando ênfase aos
          direitos do artigo 18, estando entre eles, mas não se limitando a:
        </p>
        <p>
          a) Direito de solicitar a confirmação da existência do tratamento de
          seus Dados Pessoais, quais tipos de operação e de que forma é
          realizado o tratamento de seus Dados Pessoais (como os que se referem
          a coleta, produção, recepção, classificação, utilização, acesso,
          reprodução, transmissão, distribuição, processamento, arquivamento,
          armazenamento, eliminação, avaliação ou controle da informação,
          modificação, comunicação, transferência, difusão ou extração);
        </p>
        <p>
          b) Direito de acessar as informações que a CNX tem sobre o TITULAR, em
          formato estruturado, acessível (em linguagem de máquina comum que
          possa ser aberto em qualquer computador ou de forma impressa) e
          facilitado;
        </p>
        <p>
          c) Direito de corrigir suas informações se essas informações estiverem
          imprecisas, incorretas e/ ou incompletas;
        </p>
        <p>
          d) Direito de anonimização, bloqueio ou eliminação de dados
          desnecessários, excessivos ou tratados em desconformidade com o
          disposto na LGPD;
        </p>
        <p>e) Direito de se opor ao processamento de seus dados pessoais;</p>
        <p>
          f) Direito à informação das entidades públicas e privadas com as quais
          o controlador realizou uso compartilhado de seus dados;
        </p>
        <p>
          g) Direito de portabilidade dos seus dados a outro fornecedor de
          serviço ou produto, mediante requisição expressa e observados os
          segredos comercial e industrial, de acordo com a regulamentação do
          órgão controlador;
        </p>
        <p>
          h) Direito de revogação seu consentimento a qualquer momento, a qual a
          CNX confiou para processar suas informações pessoais;
        </p>
        <p>
          i) Direito de solicitar a eliminação dos seus Dados Pessoais dos
          sistemas e aplicação da CNX;
        </p>
        <p>
          j) Direito à informação sobre a possibilidade de não fornecer
          consentimento para o tratamento de seus Dados Pessoais e sobre as
          consequências da negativa;
        </p>
        <p>
          k) Direito a solicitar a revisão de decisões tomadas unicamente com
          base em tratamento automatizado de dados pessoais que afetem seus
          interesses, incluídas as decisões destinadas a definir o seu perfil
          pessoal, profissional, de consumo e de crédito ou os aspectos de sua
          personalidade.
        </p>

        <p className="mt-4">
          O tratamento de dados pessoais realizado pela CNX terminará nas
          situações previstas no art. 15 da Lei de Proteção de Dados Pessoais
          (Lei nº 13.709/2018), sendo então os dados pessoais passiveis de
          exclusão após o término de seu tratamento, ressalvado período em que
          os dados devem ficar arquivados, conforme art. 15 do Marco Civil da
          Internet (Lei nº 12.965/14) determina.
        </p>

        <h4 className="mt-6 font-bold">11. PROVEDORES</h4>
        <p>
          A CNX poderá empregar empresas e indivíduos terceirizados para
          facilitar o seu serviço e executar serviços relacionados a suas
          operações. Esses terceiros têm acesso aos Dados Pessoais dos TITULARES
          estrita e somente para realizar essas tarefas em nome da CNX, sendo
          obrigados a não os divulgar ou usá-los para qualquer outra finalidade
          que não sejam as explicitamente destacadas nesta política.
        </p>

        <h4 className="mt-6 font-bold">12. COMPARTILHAMENTO</h4>
        <p>
          A presente política de privacidade CNX não abrange as práticas de
          privacidade dos fornecedores e terceiros em que há compartilhamento
          dos dados, visto que são entidades legais separadas e independentes.
          Contudo, a CNX imbui esforços em incentivar estas empresas a se
          adequarem a tais políticas, optando a CNX sempre por trabalhar com
          empresas que se preocupam com o tratamento seguro e transparente dos
          dados pessoais.
        </p>
        <p>
          A CNX não comunicará ou compartilhará os dados com terceiros, a menos
          que seja necessário para viabilizar seu cadastro, acesso e uso da
          Plataforma, bem como em situações que demandem a intervenção de um
          terceiro para prestação dos serviços da empresa.
        </p>
        <p>
          A CNX poderá comunicar e compartilhar dados pessoais dos USUÁRIOS com
          outros controladores como os funcionários/parceiros/colaboradores da
          própria CNX, seu servidor e parceiros e/ou softwares utilizados na
          execução de seus serviços.
        </p>
        <h4 className="mt-6 font-bold">13. LINKS PARA OUTROS SITES</h4>
        <p>
          A Plataforma da CNX pode conter links para outros sites que não são
          operados por nós. Se o USUÁRIO clicar em um link de terceiros, será
          direcionado para o site de terceiros. Recomendamos veementemente que o
          USUÁRIO reveja a Política de Privacidade de todos os sites que visita,
          haja vista que a CNX não tem controle e não assume nenhuma
          responsabilidade pelo conteúdo, políticas de privacidade ou práticas
          de quaisquer sites ou serviços de terceiros.
        </p>

        <h4 className="mt-6 font-bold">
          14. PRIVACIDADE DE CRIANÇAS E ADOLESCENTES
        </h4>
        <p>
          A CNX não solicita ou coleta, intencionalmente, dados de pessoas
          abaixo de 18 (dezoito) anos de idade.
        </p>
        <p>
          O tratamento de dados pessoais de crianças e adolescentes será
          realizado mediante consentimento específico e em destaque dado pelos
          pais ou responsáveis legais dos menores, agindo a CNX com todos os
          esforços razoáveis para verificar que tal consentimento foi realizado
          nestes termos, estando de acordo com o entendimento do art. 14 da Lei
          de Proteção de Dados Pessoais (Lei nº 13.709/2018).
        </p>
        <p>
          Caso algum dado pessoal de crianças seja coletado sem a verificação do
          consentimento dos pais, a CNX tomará medidas para remover essas
          informações de seus servidores.
        </p>

        <h4 className="mt-6 font-bold">15. REVISÕES À POLÍTICA</h4>
        <p>
          Caso a CNX modifique esta Política de Privacidade, tais alterações
          serão publicadas de forma visível no site da CNX. Esta Política é
          válida a partir de 01/11/2021. Caso o USUÁRIO tenha quaisquer questões
          a respeito das políticas de privacidade do website, por favor, entre
          em contato com a CNX, por meio dos endereços abaixo/canal de
          atendimento do Data Protection Officer.
        </p>

        <h4 className="mt-6 font-bold">16. CONTATO</h4>
        <p>
          A CNX nomeou o sócio administrador CAUE DE PAULA DAMIÃO, como Data
          Protection Officer (DPO). O USUÁRIO pode entrar em contato com o DPO
          no seguinte endereço físico ou através do e-mail dpo@lbca.com.br.
        </p>

        <h4 className="mt-6 font-bold">17. FORO DE ELEIÇÃO - arbitragem</h4>
        <p>
          Em caso de incidente com Dados Pessoais, a CNX, desde já, se reserva a
          nomear a JUSPRO – Justiça Sem Processo Mediação e Conciliação S/S
          Ltda. como Câmara de Mediação apta a dirimir as questões envolvendo os
          Usuários titulares dos dados, nos termos do artigo 52, §7º da Lei
          Geral de Proteção de Dados.
        </p>
      </div>
    </Modal>
  )
}
