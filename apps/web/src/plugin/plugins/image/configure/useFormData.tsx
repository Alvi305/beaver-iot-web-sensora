import { useMemo, useRef } from 'react';
import { useI18n } from '@milesight/shared/src/hooks';
import { ImageDataType } from '../typings';

const toggleRadioOptions: {
    intlKey: string;
    value: ImageDataType;
}[] = [
    {
        intlKey: 'common.label.select_entity',
        value: 'entity',
    },
    {
        intlKey: 'common.label.local_upload',
        value: 'upload',
    },
    {
        intlKey: 'common.label.url',
        value: 'url',
    },
];

const useFormData = (value: any, config: CustomComponentProps) => {
    const { getIntlText } = useI18n();
    const options = useMemo(() => {
        return toggleRadioOptions.map(({ intlKey, value }) => {
            return {
                label: getIntlText(intlKey),
                value,
            };
        });
    }, [getIntlText]);

    const formData: [Record<string, any>, CustomComponentProps] = useMemo(() => {
        const { configProps } = config || {};
        const { dataType, entity, file, url, ...rest } = value || {};

        const data: Record<string, any> = { ...rest, dataType };
        const props: ConfigProps[] = [
            ...configProps,
            {
                style: 'width: 100%',
                components: [
                    {
                        type: 'ToggleRadio',
                        key: 'dataType',
                        style: 'width: 100%',
                        componentProps: {
                            options,
                        },
                    },
                ],
            },
        ];

        switch (dataType) {
            case 'entity': {
                data.entity = entity;
                props.push({
                    style: 'width: 100%',
                    components: [
                        {
                            type: 'entitySelect',
                            key: 'entity',
                            title: 'Entity',
                            style: 'width: 100%',
                            rules: {
                                required: true,
                            },
                            componentProps: {
                                size: 'small',
                                entityType: ['PROPERTY'],
                                entityValueTypes: ['STRING', 'LONG', 'DOUBLE', 'BOOLEAN'],
                            },
                        },
                    ],
                });
                break;
            }
            case 'upload': {
                data.file = file;
                props.push({
                    style: 'width: 100%',
                    components: [
                        {
                            type: 'Upload',
                            key: 'file',
                            rules: {
                                required: true,
                            },
                            componentProps: {
                                label: 'Upload Image',
                                multiple: false,
                                required: true,
                            },
                        },
                    ],
                });
                break;
            }
            case 'url': {
                data.url = url;
                props.push({
                    style: 'width: 100%',
                    components: [
                        {
                            type: 'input',
                            key: 'url',
                            title: 'URL',
                            style: 'width: 100%',
                            rules: {
                                required: true,
                            },
                            componentProps: {
                                placeholder: getIntlText('common.placeholder.input'),
                            },
                        },
                    ],
                });
                break;
            }
            default: {
                data.dataType = toggleRadioOptions[0].value;
            }
        }

        return [
            data,
            {
                ...config,
                configProps: props,
            },
        ];
    }, [value, config, options, getIntlText]);

    return formData;
};

export default useFormData;
