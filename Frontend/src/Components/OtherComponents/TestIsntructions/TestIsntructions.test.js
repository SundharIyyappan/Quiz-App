import { render } from '@testing-library/react';
import TestIsntructions from './TestIsntructions';
import StudyMaterial from '../StudyMaterial';
import ChangePassword from '../ChangePassword/ChangePassword';
import Timer from '../Timer';

test('renders learn react link', () => {
  const {container} = render(<TestIsntructions />);
  const linkElement = container.getElementsByClassName('instructions');
  expect(linkElement.length).toBe(1);
});

test('renders learn react links', () => {
  const {container} = render(<ChangePassword />);
  const linkElement = container.getElementsByClassName('changePassword');
  expect(linkElement.length).toBe(1);
});

test('renders learn react links', () => {
  const {container} = render(<StudyMaterial />);
  const linkElement = container.getElementsByClassName('materials');
  expect(linkElement.length).toBe(1);
});

test('renders learn react links', () => {
  const {container} = render(<Timer />);
  const linkElement = container.getElementsByClassName('countdown');
  expect(linkElement.length).toBe(1);
});



