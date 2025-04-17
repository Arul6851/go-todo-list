pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Arul6851/go-todo-list.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("sample-app")
                }
            }
        }

        stage('Deploy in Docker') {
            steps {
                script {
                    sh "docker rm -f sample-app || true"
                    dockerImage.run("-d -p '8081:8081' --name 'sample-app' -–env-file '.env' ")
                }
            }
        }
    }
}