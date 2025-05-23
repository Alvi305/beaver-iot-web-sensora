import { useEffect, useMemo } from 'react';
import { useRequest } from 'ahooks';
import ws, { getExChangeTopic } from '@/services/ws';
import { awaitWrap, entityAPI, getResponseData, isRequestSuccess } from '@/services/http';
import type { ViewConfigProps } from '../../typings';

interface IProps {
    entity: ViewConfigProps['entity'];
}
export const useSource = (props: IProps) => {
    const { entity } = props;

    const { data: entityStatusValue, run: getEntityStatusValue } = useRequest(
        async () => {
            if (!entity?.value) return;
            const { value } = entity || {};

            const [error, resp] = await awaitWrap(entityAPI.getEntityStatus({ id: value }));
            if (error || !isRequestSuccess(resp)) return;

            return getResponseData(resp)?.value;
        },
        {
            manual: true,
            debounceWait: 300,
        },
    );
    useEffect(() => {
        getEntityStatusValue();
    }, [entity?.value]);

    const topic = useMemo(() => {
        const entityKey = entity?.rawData?.entityKey?.toString();
        return entityKey && getExChangeTopic(entityKey);
    }, [entity]);
    // Subscribe to WS theme
    useEffect(() => {
        if (!topic) return;

        return ws.subscribe(topic, getEntityStatusValue);
    }, [topic]);

    return {
        entityStatusValue,
    };
};
