/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React, { ComponentType, FC } from 'react';
import ComponentLoader from '../src/components/ComponentLoader';
import { Resource } from '../src/types';
import manifest from './fixtures/Manifest';
import TestComponent from './fixtures/TestComponent';

type FooComponentProps = { foo: string; biz: string };
const FooComponent: FC<FooComponentProps> = ({ foo, biz }) => (
  <>
    <div>{foo}</div>
    <div>{biz}</div>
  </>
);

describe('ComponentLoader', () => {
  it('should match pending snapshot', () => {
    const resource: Resource<ComponentType> = {
      read: () => undefined,
    };

    const view = render(
      <ComponentLoader remote="TestModule/TestComponent" manifest={manifest} resource={resource} />,
    );

    expect(view).toMatchSnapshot();
  });

  it('should match error snapshot', () => {
    const resource: Resource<ComponentType> = {
      read: () => new Error('Failed to load component'),
    };

    const view = render(
      <ComponentLoader remote="TestModule/TestComponent" manifest={manifest} resource={resource} />,
    );

    expect(view).toMatchSnapshot();
  });

  it('should match loaded snapshot', () => {
    const resource: Resource<ComponentType> = {
      read: () => TestComponent,
    };

    const view = render(
      <ComponentLoader remote="TestModule/TestComponent" manifest={manifest} resource={resource} />,
    );

    expect(view).toMatchSnapshot();
  });

  it('should psss additional props to component', async () => {
    const resource: Resource<ComponentType> = {
      read: () => FooComponent as ComponentType,
    };

    render(
      <ComponentLoader
        remote="TestModule/TestComponent"
        manifest={manifest}
        resource={resource}
        foo="bar"
        biz="bam"
      />,
    );

    await expect(screen.getByText(/bar/i)).toBeInTheDocument();
    await expect(screen.getByText(/bam/i)).toBeInTheDocument();
  });
});
