import React from 'react';
import { shallow } from 'enzyme';
import { assert } from 'chai';

import TreeNode from '../src/js/TreeNode';

const baseProps = {
    checked: 0,
    disabled: false,
    expandDisabled: false,
    expanded: false,
    lang: {
        collapseAll: 'Collapse',
        expandAll: 'Expand',
        toggle: 'Toggle',
    },
    icons: {
        check: <span className="rct-icon rct-icon-check" />,
        uncheck: <span className="rct-icon rct-icon-uncheck" />,
        halfCheck: <span className="rct-icon rct-icon-half-check" />,
        expandClose: <span className="rct-icon rct-icon-expand-close" />,
        expandOpen: <span className="rct-icon rct-icon-expand-open" />,
        parentClose: <span className="rct-icon rct-icon-parent-close" />,
        parentOpen: <span className="rct-icon rct-icon-parent-open" />,
        leaf: <span className="rct-icon rct-icon-leaf" />,
    },
    isLeaf: true,
    isParent: false,
    label: 'Jupiter',
    optimisticToggle: true,
    showNodeIcon: true,
    treeId: 'id',
    value: 'jupiter',
    onCheck: () => {},
    onExpand: () => {},
};

describe('<TreeNode />', () => {
    describe('component', () => {
        it('should render the rct-node container', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} />,
            );

            assert.isTrue(wrapper.find('.rct-node').exists());
        });

        it('should render a label associated with a checkbox', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} treeId="planets" value="jupiter" />,
            );

            assert.equal('planets-jupiter', wrapper.find('label').prop('htmlFor'));
            assert.equal('planets-jupiter', wrapper.find('label NativeCheckbox').prop('id'));
        });

        it('should render a label associated with a checkbox given integer value', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} treeId="planets" value={0} />,
            );

            assert.equal('planets-0', wrapper.find('label').prop('htmlFor'));
            assert.equal('planets-0', wrapper.find('label NativeCheckbox').prop('id'));
        });

        it('should render a label associated with a checkbox given float value', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} treeId="planets" value={0.25} />,
            );

            assert.equal('planets-0.25', wrapper.find('label').prop('htmlFor'));
            assert.equal('planets-0.25', wrapper.find('label NativeCheckbox').prop('id'));
        });
    });

    describe('className', () => {
        it('should append the supplied className to <li> of the node', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} className="my-test-class" />,
            );

            assert.isTrue(wrapper.find('.my-test-class').exists());
        });
    });

    describe('disabled', () => {
        it('should disable the hidden <input> element', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} disabled />,
            );

            assert.isTrue(wrapper.find('NativeCheckbox[disabled]').exists());
        });
    });

    describe('expandDisabled', () => {
        it('should disable the expand <button>', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} expandDisabled isLeaf={false} />,
            );

            assert.isTrue(wrapper.find('Button.rct-collapse-btn[disabled]').exists());
        });
    });

    describe('expanded', () => {
        it('should render children when set to true', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} expanded isLeaf={false}>
                    <TreeNode {...baseProps} label="Europa" value="europa" />
                </TreeNode>,
            );

            assert.equal('europa', wrapper.find(TreeNode).prop('value'));
        });

        it('should not render children when set to false', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} expanded={false} isLeaf={false}>
                    <TreeNode {...baseProps} />
                </TreeNode>,
            );

            assert.isFalse(wrapper.find(TreeNode).exists());
        });

        it('should render expanded icons when set to true', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} expanded isLeaf={false} />,
            );

            assert.isTrue(wrapper.contains(<span className="rct-icon rct-icon-expand-open" />));
            assert.isTrue(wrapper.contains(<span className="rct-icon rct-icon-parent-open" />));
        });

        it('should render collapsed icons when set to false', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} expanded={false} isLeaf={false} />,
            );

            assert.isTrue(wrapper.contains(<span className="rct-icon rct-icon-expand-close" />));
            assert.isTrue(wrapper.contains(<span className="rct-icon rct-icon-parent-close" />));
        });

        it('should append the `rct-node-expanded` class to the node when set to true', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} expanded isLeaf={false} />,
            );

            assert.isTrue(wrapper.find('li').hasClass('rct-node-expanded'));
        });

        it('should append the `rct-node-collapsed` class to the node when set to true', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} expanded={false} isLeaf={false} />,
            );

            assert.isTrue(wrapper.find('li').hasClass('rct-node-collapsed'));
        });

        it('should not append any expanded/collapsed classes to the node when a leaf', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} expanded isLeaf />,
            );

            assert.isFalse(wrapper.find('li').hasClass('rct-node-expanded'));
            assert.isFalse(wrapper.find('li').hasClass('rct-node-collapsed'));
        });
    });

    describe('icon', () => {
        it('should replace the node\'s icons with the supplied value', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} icon={<span className="fa fa-plus" />} />,
            );

            assert.isTrue(wrapper.contains(
                <span className="rct-node-icon">
                    <span className="fa fa-plus" />
                </span>,
            ));
        });
    });

    describe('showNodeIcon', () => {
        it('should render the node icon when true', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} />,
            );

            assert.isTrue(wrapper.contains(
                <span className="rct-node-icon">
                    <span className="rct-icon rct-icon-leaf" />
                </span>,
            ));
        });

        it('should not render the node icon when false', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} showNodeIcon={false} />,
            );

            assert.isFalse(wrapper.contains(
                <span className="rct-node-icon">
                    <span className="rct-icon rct-icon-leaf" />
                </span>,
            ));
        });
    });

    describe('title', () => {
        it('should add the `title` property to the label when set', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} title="Some extra text" />,
            );

            assert.equal('Some extra text', wrapper.find('label').prop('title'));
        });

        it('should add the `title` property to the bare label when set on a checkbox-less node', () => {
            const wrapper = shallow(
                <TreeNode {...baseProps} showCheckbox={false} title="Some extra text" />,
            );

            assert.equal('Some extra text', wrapper.find('.rct-bare-label').prop('title'));
        });
    });

    describe('onCheck', () => {
        it('should pass the current node\'s value', () => {
            let actual = {};

            const wrapper = shallow(
                <TreeNode
                    {...baseProps}
                    value="jupiter"
                    onCheck={(node) => {
                        actual = node;
                    }}
                />,
            );

            wrapper.find('NativeCheckbox').simulate('change');

            assert.equal('jupiter', actual.value);
        });

        it('should toggle an unchecked node to checked', () => {
            let actual = {};

            const wrapper = shallow(
                <TreeNode
                    {...baseProps}
                    checked={0}
                    value="jupiter"
                    onCheck={(node) => {
                        actual = node;
                    }}
                />,
            );

            wrapper.find('NativeCheckbox').simulate('change');

            assert.isTrue(actual.checked);
        });

        it('should toggle a checked node to unchecked', () => {
            let actual = {};

            const wrapper = shallow(
                <TreeNode
                    {...baseProps}
                    checked={1}
                    value="jupiter"
                    onCheck={(node) => {
                        actual = node;
                    }}
                />,
            );

            wrapper.find('NativeCheckbox').simulate('change');

            assert.isFalse(actual.checked);
        });

        it('should toggle a partially-checked node to checked', () => {
            let actual = {};

            const wrapper = shallow(
                <TreeNode
                    {...baseProps}
                    checked={2}
                    value="jupiter"
                    onCheck={(node) => {
                        actual = node;
                    }}
                />,
            );

            wrapper.find('NativeCheckbox').simulate('change');

            assert.isTrue(actual.checked);
        });

        describe('optimisticToggle', () => {
            it('should toggle a partially-checked node to unchecked', () => {
                let actual = {};

                const wrapper = shallow(
                    <TreeNode
                        {...baseProps}
                        checked={2}
                        optimisticToggle={false}
                        value="jupiter"
                        onCheck={(node) => {
                            actual = node;
                        }}
                    />,
                );

                wrapper.find('NativeCheckbox').simulate('change');

                assert.isFalse(actual.checked);
            });
        });
    });

    describe('onExpand', () => {
        it('should negate the expanded property and pass the current node\'s value', () => {
            let actual = {};

            const wrapper = shallow(
                <TreeNode
                    {...baseProps}
                    expanded
                    isLeaf={false}
                    value="jupiter"
                    onExpand={(node) => {
                        actual = node;
                    }}
                />,
            );

            wrapper.find('.rct-collapse').simulate('click');

            assert.deepEqual({ value: 'jupiter', expanded: false }, actual);
        });
    });

    describe('onClick', () => {
        it('should pass the current node\'s value', () => {
            let actual = {};

            const wrapper = shallow(
                <TreeNode
                    {...baseProps}
                    value="jupiter"
                    onClick={(node) => {
                        actual = node;
                    }}
                />,
            );

            wrapper.find('.rct-node-clickable').simulate('click');

            assert.equal('jupiter', actual.value);
        });

        it('should get the unchecked node as unchecked', () => {
            let actual = {};

            const wrapper = shallow(
                <TreeNode
                    {...baseProps}
                    checked={0}
                    value="jupiter"
                    onClick={(node) => {
                        actual = node;
                    }}
                />,
            );

            wrapper.find('.rct-node-clickable').simulate('click');

            assert.isFalse(actual.checked);
        });

        it('should get the checked node as checked', () => {
            let actual = {};

            const wrapper = shallow(
                <TreeNode
                    {...baseProps}
                    checked={1}
                    value="jupiter"
                    onClick={(node) => {
                        actual = node;
                    }}
                />,
            );

            wrapper.find('.rct-node-clickable').simulate('click');

            assert.isTrue(actual.checked);
        });

        it('should get the partially-checked node as checked', () => {
            let actual = {};

            const wrapper = shallow(
                <TreeNode
                    {...baseProps}
                    checked={2}
                    value="jupiter"
                    onClick={(node) => {
                        actual = node;
                    }}
                />,
            );

            wrapper.find('.rct-node-clickable').simulate('click');

            assert.isTrue(actual.checked);
        });
    });
});
