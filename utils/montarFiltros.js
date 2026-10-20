import { Op } from "sequelize";  

function montarFiltros(query) {
    const busca = (query.busca || '').trim();
    const periodo = ['hoje', 'ontem', 'semana'].includes(query.periodo) ? query.periodo : 'todos';

    const where = {};
    const wherePaciente = {};

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (periodo === 'hoje') {
        where.data_realizacao = { [Op.gte]: hoje };
    } else if (periodo === 'ontem') {
        const ontem = new Date(hoje);
        ontem.setDate(ontem.getDate() - 1);
        where.data_realizacao = { [Op.gte]: ontem, [Op.lt]: hoje };
    } else if (periodo === 'semana') {
        const inicio = new Date(hoje);
        inicio.setDate(inicio.getDate() - 6);
        where.data_realizacao = { [Op.gte]: inicio };
    }

    if (busca) {
        const ors = [
            { nome: { [Op.like]: `%${busca}%` } },        
            { cpf:  { [Op.like]: `%${busca}%` } },
        ];
        const numero = busca.replace(/\D/g, '');
        if (numero) {
            ors.push({ id: Number(numero) });
            ors.push({ cpf: { [Op.like]: `%${numero}%` } });
        }
        wherePaciente[Op.or] = ors;
    }

    return { busca, periodo, where, wherePaciente };
}

export default montarFiltros;