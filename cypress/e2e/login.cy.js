let Token;
let iduser;

function fazerLogin(dados) {
  cy.fixture("config.json").then((url)=> {
    cy.request({
      method: 'POST',
      url: `${url.servidor}${url.login}`,
      body: dados
    }).then((response) => {
      expect(response.status).to.eq(200);
      Token = response.body.token;
      console.log(Token);
    });
  });
}

it('fazer login com admin', () => {
  cy.fixture('body_login.json').then((dados) => {
    fazerLogin(dados);
  });
});

it('criar e deletar usuario', () => {
  cy.fixture('config.json').then((url)=>{
    cy.fixture('body_user.json').then((dados) => {
      dados.mail = "";
      dados.cpf = '';
      cy.request({
        method: 'POST',
        url: `${url.servidor}${url.user}`,
        headers: {
          Authorization: `${Token}`,
        },
        body: dados
      }).then((response) => {
        expect(response.status).to.eq(201);
        iduser = response.body.user._id;
        
        cy.request({
          method: 'DELETE',
          url: `${url.servidor}${url.user}/${iduser}`,
          headers: {
            Authorization: `${Token}`,
          }
        }).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200);
        });
      });  
    });
  });
});


