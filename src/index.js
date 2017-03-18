import * as $pnp from 'sp-pnp-js';
import * as _ from 'lodash';

const LIST_TITLE = 'MMDataTestList';

// internal field names
const MM_FieldInternalName = 'MM';
const MM_MULTI_FieldInternalName = 'MMMULTI';

let mm_multi_hidden_field;
let mm_hidden_field;

export function initPnP() {
    $pnp.setup({
        headers: {
            Accept: 'application/json; odata=verbose',
        },
    });
}

export function copyTaxonomyFieldValues(sourceItemID, destItemID) {
    loadTaxonomyHiddenFields()
        .then(() => getItemById(LIST_TITLE, sourceItemID)
            .select(MM_FieldInternalName, MM_MULTI_FieldInternalName).get())
        .then((sourceItem) => {

            let resultValue = {};

            // set single managed metadata field value
            const mm_Value = sourceItem[MM_FieldInternalName];
            const strMMDataValue = mm_Value ? mm_Value.Label + "|" + mm_Value.TermGuid : null;
            resultValue[mm_hidden_field] = strMMDataValue;

            // set multiple managed metadata field value
            const mm_multi_Value = sourceItem[MM_MULTI_FieldInternalName];
            const strMMMultiValue = mm_multi_Value ? _.map(mm_multi_Value.results, f => ('-1;#' + f.Label + '|' + f.TermGuid)).join(';') : null;
            resultValue[mm_multi_hidden_field] = strMMMultiValue;

            console.log(resultValue);

            return resultValue;
        })
        .then((r) => getItemById(LIST_TITLE, destItemID).update(r))
        .then(() => console.log("OK"))
        .catch((err) => console.log(err));
}

function loadTaxonomyHiddenFields() {
    return $pnp.sp.web.lists.getByTitle(LIST_TITLE).fields.select('Title', 'InternalName').get()
        .then((fields) => {
            mm_hidden_field = _.find(fields, {
                Title: (MM_FieldInternalName + '_0')
            }).InternalName;

            mm_multi_hidden_field = _.find(fields, {
                Title: (MM_MULTI_FieldInternalName + '_0')
            }).InternalName;
        });
}

function getItemById(listTitle, id) {
    return $pnp.sp.web.lists.getByTitle(listTitle).items.getById(id);
}